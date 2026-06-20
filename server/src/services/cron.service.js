const cron = require('node-cron');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { ScheduledAllocation, User, Company, TokenTransaction, Team, TeamMember } = require('../models');
const { resolveTargets } = require('./targetResolver.service');

function nextMonthly(dayOfMonth) {
  const now = new Date();
  const candidate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), dayOfMonth, 9, 0, 0));
  if (candidate <= now) {
    candidate.setUTCMonth(candidate.getUTCMonth() + 1);
  }
  return candidate;
}

function nextAnnual(dayOfMonth, month) {
  const now = new Date();
  // month is 1-based
  const candidate = new Date(Date.UTC(now.getUTCFullYear(), month - 1, dayOfMonth, 9, 0, 0));
  if (candidate <= now) {
    candidate.setUTCFullYear(candidate.getUTCFullYear() + 1);
  }
  return candidate;
}

async function runScheduledAllocations() {
  const due = await ScheduledAllocation.findAll({
    where: {
      active: true,
      next_run_at: { [Op.lte]: new Date() },
    },
    include: [
      { model: User, as: 'sender' },
      { model: User, as: 'receiver' },
      { model: Company, as: 'company' },
    ],
  });

  for (const rule of due) {
    const targets = await resolveTargets({
      company_id: rule.company_id,
      target_type: rule.target_type,
      receiver_id: rule.receiver_id,
      target_team_id: rule.target_team_id,
      excluded_user_ids: Array.isArray(rule.excluded_user_ids) ? rule.excluded_user_ids : [],
    });

    for (const receiver of targets) {
      if (!receiver) continue;
      const t = await sequelize.transaction();
      try {
        const sender = await User.findByPk(rule.sender_id, { lock: true, transaction: t });

        if (sender && sender.role === 'manager') {
          const team = await Team.findOne({ where: { manager_id: sender.id, dissolved_at: null }, lock: true, transaction: t });
          if (!team || team.token_balance < rule.amount) {
            await t.rollback();
            continue;
          }
          await team.decrement('token_balance', { by: rule.amount, transaction: t });
        } else {
          const company = await Company.findOne({
            where: { id: rule.company_id },
            lock: true,
            transaction: t,
          });
          if (!company || company.token_balance < rule.amount) {
            await t.rollback();
            continue;
          }
          await company.decrement('token_balance', { by: rule.amount, transaction: t });
        }

        if (rule.target_account === 'team' && receiver.role === 'manager') {
          const receiverTeam = await Team.findOne({ where: { manager_id: receiver.id, dissolved_at: null }, lock: true, transaction: t });
          if (receiverTeam) {
            await receiverTeam.increment('token_balance', { by: rule.amount, transaction: t });
          } else {
            await receiver.increment('token_balance', { by: rule.amount, transaction: t });
          }
        } else {
          await receiver.increment('token_balance', { by: rule.amount, transaction: t });
        }

        await TokenTransaction.create(
          {
            sender_id: rule.sender_id,
            receiver_id: receiver.id,
            company_id: rule.company_id,
            amount: rule.amount,
            type: rule.target_account === 'team' ? 'employer_to_team' : (rule.label || 'scheduled_allocation'),
          },
          { transaction: t }
        );

        await t.commit();
      } catch {
        await t.rollback();
      }
    }

    // Calcul de la prochaine exécution
    const nextRun =
      rule.frequency === 'monthly'
        ? nextMonthly(rule.day_of_month)
        : nextAnnual(rule.day_of_month, rule.month);

    await rule.update({ next_run_at: nextRun });
  }
}

function startCron() {
  // Exécution tous les jours à 09h00 UTC
  cron.schedule('0 9 * * *', () => {
    runScheduledAllocations().catch((err) =>
      console.error('[cron] scheduled allocations error:', err.message)
    );
  });
  console.log('[cron] Scheduled allocations cron started');
}

module.exports = { startCron, runScheduledAllocations };
