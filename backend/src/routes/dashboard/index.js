const express = require('express');
const statsRoutes = require('./stats');
const categoryRoutes = require('./category');

const router = express.Router();

router.use('/stats', statsRoutes);
router.use('/category', categoryRoutes);

module.exports = router; 