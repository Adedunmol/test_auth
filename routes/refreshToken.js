const express = require('express');
const router = express.Router();
const getNewRefreshToken = require('../controllers/refreshTokenController');

router.route('/').get(getNewRefreshToken)

module.exports = router;