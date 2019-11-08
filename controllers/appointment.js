"use strict";

const Appt = require('../model/Appointment');
const { validationResult } = require('express-validator');

const createAppt = async (req, res, next) => {
    try {
        const validationErrs = validationResult(req);
        if (!validationErrs.isEmpty()) {
            return res.status(400).send(validationErrs)
        }
        const appt = new Appt(req.body);
        const savedAppt = await appt.save();
        res.send({ appt: appt._id });
    } catch (err) {
        res.status(400).send(err);
    }
}

const delAppt = (req, res, next) => {
    try {
        Appt.deleteOne({ _id: req.params.id })
            .exec((err, appt) => {
                if (err) throw err;
                if (appt.deletedCount > 0) {
                    res.send({ deleted: req.params.id })
                } else {
                    res.status(400).send({ error: 'Unable to delete appointment ' + req.params.id })
                }
            })
    } catch (err) {
        res.status(400).send(err);
    }
}

const updateAppt = (req, res, next) => {
    try {
        Appt.findOneAndUpdate({ _id: req.params.id },
            req.body,
            (err, appt) => {
                if (err) throw err;
                if (appt) {
                    res.send({ updated: req.params.id })
                } else {
                    res.status(400).send({ error: 'No appointment found with id ' + req.params.id })
                }
            });
    } catch (err) {
        res.status(400).send(err);
    }
}


const getAppts = (req, res, next) => {
    try {
        Appt.find({}, (err, appts) => {
            if (err) throw err;
            res.send(appts);
        })
    } catch (err) {
        res.status(400).send(err);
    }
}

const getAppt = (req, res, next) => {
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
}

module.exports = {
    createAppt: createAppt,
    delAppt: delAppt,
    updateAppt: updateAppt,
    getAppts: getAppts,
    getAppt: getAppt

}