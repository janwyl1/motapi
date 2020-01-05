"use strict";

const router = require('express').Router();
const apptCtrl = require('../controllers/appointment');
const {requiresLogin, isAdmin} = require('../middleware/auth');
const {validate, handleValidationErrs} = require('../middleware/validate');

/** Create new appointment */
router.post('/', validate('appt'), handleValidationErrs, requiresLogin, apptCtrl.createAppt);

/** Delete appointment matching :id */
router.delete('/:id', validate('id'), handleValidationErrs, requiresLogin, apptCtrl.delAppt);

/** Update appointment matching :id */
router.put('/:id', validate('id'), validate('appt'), handleValidationErrs, requiresLogin, apptCtrl.updateAppt);

/** GET all appointments */
router.get('/', requiresLogin, isAdmin, apptCtrl.getAppts);

/** GET appointment matching :id */
router.get('/:id', validate('id'), handleValidationErrs, requiresLogin, apptCtrl.getAppt);

module.exports = router;