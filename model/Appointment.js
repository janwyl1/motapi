"use strict";

const mongoose = require('mongoose');

const apptSchema = new mongoose.Schema({
    apptDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    apptTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    customer: {
        name: {
            type: String,
            required: true,
            max: 1024,
            min: 2,
            trim: true,
            lowercase: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
            // validate: [validateEmail, 'Please fill a valid email address'],
            // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        mobile: {
            type: String,
            trim: true,
            required: true
        },
        altPhone: {
            type: String,
            trim: true
        }
    },
    car: {
        registration: {
            type: String,
            trim: true,
            max: 7,
            uppercase: true,
            required: true
        },
        make: {
            type: String,
            trim: true,
            lowercase: true
        },
        model: {
            type: String,
            trim: true,
            lowercase: true
        },
        firstUsed: {
            type: Date,
            default: Date.now
        },
        fuelType: {
            type: String,
            trim: true,
            lowercase: true
        },
        color: {
            type: String,
            trim: true,
            lowercase: true
        },
        vehicleId: {
            type: String,
            trim: true,
            lowercase: true
        },
        regDate: {
            type: Date,
            default: Date.now
        },
        manufacDate: {
            type: Date,
            default: Date.now
        },
        engineSize: {
            type: Number
        }
        // motTests: [{
        //     completedDate: {
        //         type: Date,
        //         default: Date.now
        //     },
        //     testResult: {
        //         type: String
        //     },
        //     expiryDate: {
        //         type: Date,
        //         default: Date.now
        //     },
        //     odometerValue: {
        //         type: Number
        //     },
        //     odometerUnit: {
        //         type: String
        //     },
        //     odometerResultType: {
        //         type: String
        //     },
        //     motTestNumber: {
        //         type: String
        //     },
        //     rfrAndComments: [{
        //         text: {
        //             type: String
        //         },
        //         type: {
        //             type: String
        //         },
        //         dangerous: {
        //             type: Boolean
        //         }
        //     }]
        // }]
    }



});

module.exports = mongoose.model('Appointment', apptSchema);


