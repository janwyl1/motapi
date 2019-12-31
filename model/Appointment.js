"use strict";

const mongoose = require('mongoose');

const apptSchema = new mongoose.Schema({
    user: { // store the id of the user who created the appointment
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, 
    apptDate: {
        type: Date,
        default: Date.now,
        required: true,
        maxLength: 1024
    },
    customer: {
        name: {
            type: String,
            required: true,
            maxLength: 1024,
            trim: true,
            lowercase: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
            maxLength: 1024
        },
        phone: {
            type: String,
            trim: true,
            required: true,
            maxLength: 30
        },
        altPhone: {
            type: String,
            trim: true,
            maxLength: 30
        }
    },
    car: {
        registration: {
            type: String,
            trim: true,
            maxLength: 7,
            uppercase: true,
            required: true
        },
        make: {
            type: String,
            trim: true,
            lowercase: true,
            maxLength: 1024
        },
        model: {
            type: String,
            trim: true,
            lowercase: true,
            maxLength: 1024
        },
        firstUsed: {
            type: Date,
            default: Date.now,
            trim: true,
            maxLength: 1024
        },
        fuelType: {
            type: String,
            trim: true,
            lowercase: true,
            maxLength: 1024
        },
        color: {
            type: String,
            trim: true,
            lowercase: true,
            maxLength: 1024
        },
        vehicleId: {
            type: String,
            trim: true,
            lowercase: true,
            maxLength: 1024
        },
        regDate: {
            type: Date,
            default: Date.now,
            trim: true,
            maxLength: 1024
        },
        manufacDate: {
            type: Date,
            default: Date.now,
            trim: true,
            maxLength: 1024
        },
        engineSize: {
            type: Number,
            maxLength: 10,
            trim: true,
            maxLength: 1024
        },
        motTests: [{
            completedDate: {
                type: Date,
                default: Date.now
            },
            testResult: {
                type: String
            },
            expiryDate: {
                type: Date,
                default: Date.now
            },
            odometerValue: {
                type: Number
            },
            odometerUnit: {
                type: String
            },
            odometerResultType: {
                type: String
            },
            motTestNumber: {
                type: String
            },
            rfrAndComments: [{
                text: {
                    type: String
                },
                type: {
                    type: String
                },
                dangerous: {
                    type: Boolean
                }
            }]
        }]
    }
});


const Appt = mongoose.model('Appointment', apptSchema)

module.exports = Appt;