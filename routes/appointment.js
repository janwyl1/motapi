"use strict";

const router = require('express').Router();
const Appt = require('../model/Appointment');
const apptCtrl = require('../controllers/appointment');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

/** Create new appointment */
router.post('/new', validate('appt'), apptCtrl.createAppt);

/** Delete appointment matching :id */
router.delete('/:id', validate('id'), auth, apptCtrl.delAppt);

/** Update appointment matching :id */
router.put('/:id', validate('id'), validate('appt'), auth, apptCtrl.updateAppt);

/** GET all appointments */
router.get('/', auth, apptCtrl.getAppts);

/** GET appointment matching :id */
router.get('/:id', auth, apptCtrl.getAppt);

module.exports = router;