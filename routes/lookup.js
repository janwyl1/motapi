"use strict";

const router = require('express').Router();
const lookupCtrl = require('../controllers/lookup');
const {validate, handleValidationErrs} = require('../middleware/validate');

/** Lookup Reg Data */
router.get('/:reg', validate('reg'), handleValidationErrs, lookupCtrl.fetchData)

module.exports = router;