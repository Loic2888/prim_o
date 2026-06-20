const marketplaceService = require('../services/marketplace.service');

const listItems = async (req, res, next) => {
  try {
    const data = await marketplaceService.listItems();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getItem = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const data = await marketplaceService.getItem(req.params.id, { includePromoCode: isAdmin });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const createItem = async (req, res, next) => {
  try {
    const data = await marketplaceService.createItem(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const data = await marketplaceService.updateItem(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    await marketplaceService.deleteItem(req.params.id);
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};

const redeem = async (req, res, next) => {
  try {
    const data = await marketplaceService.redeem(req.user.id, req.body.voucher_id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const listOrders = async (req, res, next) => {
  try {
    const data = await marketplaceService.listOrders(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const adminListVouchers = async (req, res, next) => {
  try {
    const data = await marketplaceService.adminListVouchers();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const adminHistory = async (req, res, next) => {
  try {
    const data = await marketplaceService.adminHistory();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const companyOrders = async (req, res, next) => {
  try {
    let data = [];
    if (req.user.role === 'employer') {
      data = await marketplaceService.listCompanyOrders(req.user.company_id);
    } else if (req.user.role === 'manager') {
      const { Team } = require('../models');
      const team = await Team.findOne({ where: { manager_id: req.user.id } });
      if (team) {
        data = await marketplaceService.listTeamOrders(team.id);
      }
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listItems, getItem, createItem, updateItem, deleteItem, redeem,
  listOrders, adminListVouchers, adminHistory, companyOrders,
};
