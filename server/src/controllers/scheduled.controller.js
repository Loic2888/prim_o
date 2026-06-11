const { ScheduledAllocation, User } = require('../models');

function nextMonthly(dayOfMonth) {
  const now = new Date();
  const candidate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), dayOfMonth, 9, 0, 0));
  if (candidate <= now) candidate.setUTCMonth(candidate.getUTCMonth() + 1);
  return candidate;
}

function nextAnnual(dayOfMonth, month) {
  const now = new Date();
  const candidate = new Date(Date.UTC(now.getUTCFullYear(), month - 1, dayOfMonth, 9, 0, 0));
  if (candidate <= now) candidate.setUTCFullYear(candidate.getUTCFullYear() + 1);
  return candidate;
}

const withReceiver = {
  include: [{ model: User, as: 'receiver', attributes: ['id', 'first_name', 'name', 'email'] }],
};

const list = async (req, res, next) => {
  try {
    const rules = await ScheduledAllocation.findAll({
      where: { company_id: req.user.company_id },
      ...withReceiver,
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, data: rules });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { receiver_id, amount, label, frequency, day_of_month, month, excluded_user_ids } = req.body;

    const next_run_at =
      frequency === 'monthly'
        ? nextMonthly(day_of_month)
        : nextAnnual(day_of_month, month);

    const rule = await ScheduledAllocation.create({
      company_id: req.user.company_id,
      sender_id: req.user.id,
      receiver_id: receiver_id || null,
      amount,
      label: label || null,
      frequency,
      day_of_month,
      month: frequency === 'annual' ? month : null,
      next_run_at,
      excluded_user_ids: receiver_id ? [] : (excluded_user_ids || []),
    });

    const full = await ScheduledAllocation.findByPk(rule.id, withReceiver);
    res.status(201).json({ success: true, data: full });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const rule = await ScheduledAllocation.findOne({
      where: { id: req.params.id, company_id: req.user.company_id },
    });
    if (!rule) return res.status(404).json({ error: 'Not found', code: 404 });

    const { receiver_id, amount, label, frequency, day_of_month, month, excluded_user_ids } = req.body;

    const next_run_at =
      frequency === 'monthly'
        ? nextMonthly(day_of_month)
        : nextAnnual(day_of_month, month);

    await rule.update({
      receiver_id: receiver_id || null,
      amount,
      label: label || null,
      frequency,
      day_of_month,
      month: frequency === 'annual' ? month : null,
      next_run_at,
      excluded_user_ids: receiver_id ? [] : (excluded_user_ids || []),
    });

    const full = await ScheduledAllocation.findByPk(rule.id, withReceiver);
    res.json({ success: true, data: full });
  } catch (err) {
    next(err);
  }
};

const toggle = async (req, res, next) => {
  try {
    const rule = await ScheduledAllocation.findOne({
      where: { id: req.params.id, company_id: req.user.company_id },
    });
    if (!rule) return res.status(404).json({ error: 'Not found', code: 404 });

    await rule.update({ active: !rule.active });
    res.json({ success: true, data: rule });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const rule = await ScheduledAllocation.findOne({
      where: { id: req.params.id, company_id: req.user.company_id },
    });
    if (!rule) return res.status(404).json({ error: 'Not found', code: 404 });

    await rule.destroy();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, update, toggle, remove };
