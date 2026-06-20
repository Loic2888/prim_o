const tokenService = require('../services/token.service');
const stripeService = require('../services/stripe.service');
const { Company } = require('../models');

const allocate = async (req, res, next) => {
  try {
    const data = await tokenService.allocate(req.user, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getBalance = async (req, res, next) => {
  try {
    const data = await tokenService.getBalance(req.params.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const listTransactions = async (req, res, next) => {
  try {
    const query = { ...req.query, company_id: req.user.company_id };
    
    // Un employé ne peut voir que ses propres transactions
    if (req.user.role === 'employee') {
      query.userId = req.user.id;
    } else if (req.user.role === 'manager') {
      const { Team } = require('../models');
      const team = await Team.findOne({ where: { manager_id: req.user.id } });
      if (team) {
        query.managerTeamId = team.id;
      }
    }
    
    const data = await tokenService.listTransactions(query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getTransaction = async (req, res, next) => {
  try {
    const data = await tokenService.getTransaction(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const stripeWebhook = async (req, res, next) => {
  try {
    await stripeService.handleWebhook(req);
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};

const subscribe = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.user.company_id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    const result = await stripeService.createOrUpdateSubscription(company, req.body.planId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getSubscription = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.user.company_id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    const subscription = await stripeService.getSubscription(company);
    res.json({ subscription });
  } catch (err) {
    next(err);
  }
};

const adminDeduct = async (req, res, next) => {
  try {
    await tokenService.adminDeduct(req.user, req.body);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  allocate,
  getBalance,
  listTransactions,
  getTransaction,
  stripeWebhook,
  subscribe,
  getSubscription,
  adminDeduct,
};
