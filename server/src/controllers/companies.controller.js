const companiesService = require('../services/companies.service');

const create = async (req, res, next) => {
  try {
    const data = await companiesService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await companiesService.getById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await companiesService.list();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await companiesService.update(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getById, list, update };
