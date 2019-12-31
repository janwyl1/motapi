"use strict";

const router = require('express').Router();
const lookupCtrl = require('../controllers/lookup');
const validate = require('../middleware/validate');

/** Lookup Reg Data */
router.get('/:reg', validate('reg'), lookupCtrl.fetchData)

module.exports = router;