"use strict";

const Appt = require('../model/Appointment');
const { validationResult } = require('express-validator');
const request = require('request-promise');

/** Fetch data from .gov MOTH API */
const fetchData = async (req, res, next) => {
    try {
        const validationErrs = await validationResult(req);
        if (!validationErrs.isEmpty()) {
            return res.status(400).send(validationErrs)
        }
        request({ 
            uri: 'https://beta.check-mot.service.gov.uk/trade/vehicles/mot-tests?registration=' + req.params.reg, 
            headers: {
                'Accept': 'application/json',
                'x-api-key': process.env.MOTH_API_KEY,
            }
        }).then(data => {
            res.status(200).json(JSON.parse(data));
        }).catch(err => {
            res.status(err.statusCode).json(JSON.parse(err.error))
        })
    } catch(err) {
        res.status(400).send(err);
    }
}

module.exports = {
    fetchData : fetchData
}