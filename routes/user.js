"use strict";

const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { header, check, validationResult } = require('express-validator');
const validate = require('../middleware/validate');
const userCtrl = require('../controllers/user.js');

/** Create a new user */
router.post('/', validate('user'), userCtrl.createUser)

/** Login a registered user */
router.post('/login', validate('login'), userCtrl.login)

/** View logged in user profile */
router.get('/me', auth, userCtrl.viewProfile)

/** Log user out of the application */
router.post('/me/logout', validate('authHeader'), auth, userCtrl.logout)

/** Log user out of all devices */
router.post('/me/logoutall', validate('authHeader'), auth, userCtrl.logoutAll)

module.exports = router;