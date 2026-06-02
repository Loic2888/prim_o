const { Router } = require('express');

const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const tokensRoutes = require('./tokens.routes');
const marketplaceRoutes = require('./marketplace.routes');
const companiesRoutes = require('./companies.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/tokens', tokensRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/companies', companiesRoutes);

module.exports = router;
