"use strict";

const router = require('express').Router();
const auth = require('../middleware/auth');
const Appt = require('../model/Appointment');

/** Create new appointment */
router.post('/new', async (req, res, next) => {
    try {
        const appt = new Appt(req.body);
        const savedAppt = await appt.save();
        res.send({ appt: appt._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

/** Delete specific appointment */
router.delete('/:id', auth, (req, res, next) => {
    try {
        Appt.deleteOne({ _id: req.params.id })
            .exec((err, appt) => {
                if (err) throw err;                
                res.send({ deleted: req.params.id });
            })
    } catch (err) {
        res.status(400).send(err);
    }
});

/** Update specific appointment */
router.put('/:id', auth, (req, res, next) => {
    try {
        Appt.findOneAndUpdate({ _id: req.params.id },  
            req.body,
            (err, appt) => {
            	if (err) throw err;
            	res.send({updated: req.params.id})
            });
    } catch (err) {
         res.status(400).send(err);
    }
});

/** GET all appointments */
router.get('/', auth, (req, res, next) => {
    try {
        Appt.find({}, (err, appts) => {
            if (err) throw err;
            res.send(appts);
        })
    } catch (err) {
         res.status(400).send(err);
    }
});

/** GET appointment by id */
router.get('/:id', auth, (req, res, next) => {
    try {
        Appt.find({ _id: req.params.id }, (err, appt) => {
            if (err) throw err;
            if (appt.length < 1) { 
                return res.status(400).send({ error: 'No appointment found with id ' + req.params.id })
            }
            res.send(appt);
        })
    } catch (err) {
        res.status(400).send(err);
    }
});


module.exports = router;