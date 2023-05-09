const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();

router.post(
    '/create',
    apiController.create,
);

router.post(
    '/join',
    apiController.join,
);

module.exports = router;