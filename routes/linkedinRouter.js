require('dotenv').config();
const controller = require('../controllers/linkedinController')

const express = require('express');
const router = express.Router();

router.get('/token', controller.token);
router.get('/user', controller.user)
router.get('/org/:key', controller.org)

module.exports = router;
