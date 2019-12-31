"use strict";

const Appt = require('../model/Appointment');
const { validationResult } = require('express-validator');

/** Check if user is owner of appt */
const _checkIfOwner = (appt, user) => {
    if (appt.user === user._id) { return true; } 
    return false;
}

/** Create Appointment */
const createAppt = async (req, res, next) => {
    try {
        const validationErrs = validationResult(req);
        if (!validationErrs.isEmpty()) {
            return res.status(400).send(validationErrs)
        }
        const appt = new Appt({...req.body, user: req.user._id});
        const savedAppt = await appt.save();
        res.send({created: appt});
    } catch (err) {
        res.status(400).send(err);
    }
}

/** Delete Appointment */
const delAppt = (req, res, next) => {
    const validationErrs = validationResult(req);
    if (!validationErrs.isEmpty()) {
        return res.status(400).send(validationErrs)
    }

    Appt.findById(req.params.id)
    .exec((err, appt) => {
        /** Check for errors or if no appointment found */
        if (err || !appt) return res.status(400).send({ error: 'No appointment found with id ' + req.params.id })
        /** Check Ownership */
        let isOwner = _checkIfOwner(appt.user.toString(), req.user._id.toString());    
        if (!isOwner) return res.status(400).send({ error: 'Cant modify another users appointment' }) 
        /* Remove appointment */
        appt.remove(err => {
            if (err) return res.status(500).send({error: 'Unable to delete appointment: ' + req.params.id})
            res.send({deleted: appt})
        })
    })
}

/** Update Appointment */
const updateAppt = (req, res, next) => {
    Appt.findById(req.params.id)
    .exec((err, appt) => {
        /** Check for errors or if no appointment found */
        if (err || !appt) return res.status(400).send({ error: 'No appointment found with id ' + req.params.id })
        
        /** Check Ownership */
        let isOwner = _checkIfOwner(appt.user.toString(), req.user._id.toString());    
        if (!isOwner) return res.status(400).send({ error: 'Cant modify another users appointment' }) 
        
        /** Update appointment */
        appt.update({upsert: false},
            req.body,
            (err, appt) => {
                if (err || !appt) return res.status(400).send({ error: 'No appointment found with id ' + req.params.id })
                    res.send({ updated: req.params.id })
        });
    })
}

/** Get Appointments */
const getAppts = (req, res, next) => {
    Appt.find({}, (err, appts) => {
        if (err || appts.length < 1) return res.status(400).send({ error: 'No appointments found' });
        res.send(appts);
    })
}

/** Get Appointment by ID */
const getAppt = (req, res, next) => {
    Appt.find({ _id: req.params.id }, 
        (err, appt) => {
        if (err || !appt || appt.length < 1 ) return res.status(400).send({ error: 'No appointment found with id ' + req.params.id })
        res.send(appt);
    })
}

module.exports = {
    createAppt: createAppt,
    delAppt: delAppt,
    updateAppt: updateAppt,
    getAppts: getAppts,
    getAppt: getAppt
}