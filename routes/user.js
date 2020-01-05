"use strict";

const router = require('express').Router();
const {requiresLogin} = require('../middleware/auth');
const {validate} = require('../middleware/validate');
const userCtrl = require('../controllers/user.js');

/** Create a new user */
router.post('/', validate('user'), userCtrl.createUser)

/** Login a registered user */
router.post('/login', validate('login'), userCtrl.login)

/** View logged in user profile */
router.get('/me', requiresLogin, userCtrl.viewProfile)

/** Log user out of the application */
router.post('/me/logout', validate('authHeader'), requiresLogin, userCtrl.logout)

/** Log user out of all devices */
router.post('/me/logoutall', validate('authHeader'), requiresLogin, userCtrl.logoutAll)

module.exports = router;