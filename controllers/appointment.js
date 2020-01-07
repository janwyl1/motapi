"use strict";

const Appt = require('../model/Appointment');

/** Check if user is owner of appt */
const _checkIfOwner = (appt, user) => {
    if (appt.user === user._id) { return true; } 
    return false;
}

/** Create Appointment */
const createAppt = async(req, res, next) => {
    try {
        const appt = new Appt({...req.body, user: req.user._id});
        const savedAppt = await appt.save();
        res.send({created: appt});  
    } catch (err) {
        res.status(400).send(err.message);
    }
}
/** Get Appointments */
const getAppts = async(req, res, next) => {
    try {
        const appts = await Appt.find({}).exec()
        if (!appts || appts.length < 1) throw new Error('No appointments found');
        res.send(appts);
    } catch(err) {
        return res.status(400).send({ error: err.message })
    }
}

/** Get Appointment by ID */
const getAppt = async (req, res, next) => {
    try {
        /** Find Appointment */
        const appt = await Appt.findById(req.params.id).exec()
        if (!appt || appt.length < 1 ) throw new Error('No appointment found with id ' + req.params.id)
        /** Check Ownership */
        const isOwner = await _checkIfOwner(appt.user.toString(), req.user._id.toString()) 
        if (!isOwner) throw new Error('Cant modify another users appointment') 
        res.send(appt)
    }
    catch(err) {
        res.status(400).send({ error: err.message })
    }
}

/** Update Appointment */
const updateAppt = async (req, res, next) => {
    try { 
        /** Find Appointment */
        const appt = await Appt.findById(req.params.id).exec()
        if (!appt) throw new Error('No appointment found with id ' + req.params.id)
        /** Check Ownership */
        const isOwner = await _checkIfOwner(appt.user.toString(), req.user._id.toString()) 
        if (!isOwner) throw new Error('Cant modify another users appointment') 
        /** Update appointment */
        const updatedAppt = await appt.update({upsert: false}, req.body).exec()
        if (!updatedAppt) throw new Error('No appointment found with id ' + req.params.id)
        res.send({ updated: req.params.id })
    }
    catch(err) {
        res.status(400).send({ error: err.message })
    }
}

/** Delete Appointment */
const delAppt = async(req, res, next) => {
    try {
        /** Find Appointment */
        const appt = await Appt.findById(req.params.id).exec()
        if (!appt) throw new Error('No appointment found with id ' + req.params.id)
        /** Check Ownership */
        const isOwner = await _checkIfOwner(appt.user.toString(), req.user._id.toString())
        if (!isOwner) throw new Error('Cant modify another users appointment') 
        /** Delete appointment */
        const removedAppt = await appt.remove()
        if (!removedAppt) throw new Error('Unable to delete appointment: ' + req.params.id)
        res.send({deleted: appt})
    }
    catch (err) {
        res.status(400).send({ error: err.message })
    }
}

module.exports = {
    createAppt: createAppt,
    getAppts: getAppts,
    getAppt: getAppt,
    updateAppt: updateAppt,
    delAppt: delAppt
}