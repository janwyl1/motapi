"use strict";

const Appt = require('../model/Appointment');
const { validationResult } = require('express-validator');
const request = require('request-promise');

/** Fetch data from .gov MOTH API */
const fetchData = async (req, res, next) => {
    // if (!req.params.reg) return res.status(400).send({error: 'Missing Registration'}) // doesnt get sent back
    const validationErrs = validationResult(req);
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
}

module.exports = {
    fetchData : fetchData
}

// Incorrect iD status 404
// {
//     "httpStatus": "404",
//     "errorMessage": "No MOT Tests found with vehicle registration : mt55whr2123",
//     "awsRequestId": "5f6c8efd-250a-43c2-a0a7-c922a2825a47"
// }

// NO key status 403
// {
//     "message": "Forbidden"
// }

// OK
// [
//     {
//         "registration": "MT55WHR",
//         "make": "FORD",
//         "model": "FIESTA",
//         "firstUsedDate": "2005.12.30",
//         "fuelType": "Petrol",
//         "primaryColour": "Black",
//         "motTests": [
//             {
//                 "completedDate": "2019.01.04 11:45:45",
//                 "testResult": "PASSED",
//                 "expiryDate": "2020.01.07",
//                 "odometerValue": "67916",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "232597121594",
//                 "rfrAndComments": [
//                     {
//                         "text": "Offside Rear Tyre slightly damaged/cracking or perishing  Tyre has age related cracking (5.2.3 (d) (ii))",
//                         "type": "ADVISORY"
//                     },
//                     {
//                         "text": "Nearside Windscreen wiper blade defective (3.4 (b) (i))",
//                         "type": "MINOR"
//                     }
//                 ]
//             },
//             {
//                 "completedDate": "2018.01.08 17:19:41",
//                 "testResult": "PASSED",
//                 "expiryDate": "2019.01.07",
//                 "odometerValue": "63047",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "645785807813",
//                 "rfrAndComments": [
//                     {
//                         "text": "Coolant leak ()",
//                         "type": "ADVISORY"
//                     }
//                 ]
//             },
//             {
//                 "completedDate": "2018.01.08 13:29:16",
//                 "testResult": "FAILED",
//                 "odometerValue": "63047",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "909291706427",
//                 "rfrAndComments": [
//                     {
//                         "text": "Offside Front Front position lamp(s) not working (1.1.A.3b)",
//                         "type": "FAIL"
//                     },
//                     {
//                         "text": "Offside Rear Direction indicator incorrect colour (1.4.A.2f)",
//                         "type": "FAIL"
//                     },
//                     {
//                         "text": "Nearside Rear Direction indicator incorrect colour (1.4.A.2f)",
//                         "type": "FAIL"
//                     },
//                     {
//                         "text": "Offside Side repeater incorrect colour (1.4.A.2f)",
//                         "type": "FAIL"
//                     },
//                     {
//                         "text": "Coolant leak ()",
//                         "type": "ADVISORY"
//                     }
//                 ]
//             },
//             {
//                 "completedDate": "2016.10.29 14:36:12",
//                 "testResult": "PASSED",
//                 "expiryDate": "2017.11.13",
//                 "odometerValue": "56098",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "931817053933",
//                 "rfrAndComments": [
//                     {
//                         "text": "Nearside Front Shock absorber has a light misting of oil (2.7.3)",
//                         "type": "ADVISORY"
//                     },
//                     {
//                         "text": "Offside Front Tyre worn close to the legal limit  tyre has age related cracking (4.1.E.1)",
//                         "type": "ADVISORY"
//                     },
//                     {
//                         "text": "nearside rear tyre has age related cracking",
//                         "type": "ADVISORY"
//                     }
//                 ]
//             },
//             {
//                 "completedDate": "2015.11.07 09:58:03",
//                 "testResult": "PASSED",
//                 "expiryDate": "2016.11.13",
//                 "odometerValue": "50946",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "216152654099",
//                 "rfrAndComments": []
//             },
//             {
//                 "completedDate": "2014.11.14 15:48:52",
//                 "testResult": "PASSED",
//                 "expiryDate": "2015.11.13",
//                 "odometerValue": "48311",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "169198914381",
//                 "rfrAndComments": []
//             },
//             {
//                 "completedDate": "2014.11.14 15:48:52",
//                 "testResult": "FAILED",
//                 "odometerValue": "48311",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "576308114377",
//                 "rfrAndComments": [
//                     {
//                         "text": "Nearside Front coil spring broken (2.4.C.1a)",
//                         "type": "PRS"
//                     }
//                 ]
//             },
//             {
//                 "completedDate": "2014.01.04 11:20:17",
//                 "testResult": "PASSED",
//                 "expiryDate": "2015.01.17",
//                 "odometerValue": "46280",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "868534104014",
//                 "rfrAndComments": []
//             },
//             {
//                 "completedDate": "2014.01.04 09:59:46",
//                 "testResult": "FAILED",
//                 "odometerValue": "46280",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "737294904094",
//                 "rfrAndComments": [
//                     {
//                         "text": "Front coil spring fractured (2.4.C.1a)",
//                         "type": "FAIL"
//                     }
//                 ]
//             },
//             {
//                 "completedDate": "2013.01.05 10:41:22",
//                 "testResult": "PASSED",
//                 "expiryDate": "2014.01.17",
//                 "odometerValue": "43680",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "238645003087",
//                 "rfrAndComments": []
//             },
//             {
//                 "completedDate": "2012.01.18 13:48:41",
//                 "testResult": "PASSED",
//                 "expiryDate": "2013.01.17",
//                 "odometerValue": "40789",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "868018512090",
//                 "rfrAndComments": []
//             },
//             {
//                 "completedDate": "2011.01.17 15:39:49",
//                 "testResult": "PASSED",
//                 "expiryDate": "2012.01.17",
//                 "odometerValue": "36411",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "277997911064",
//                 "rfrAndComments": []
//             },
//             {
//                 "completedDate": "2010.01.18 09:52:08",
//                 "testResult": "PASSED",
//                 "expiryDate": "2011.01.17",
//                 "odometerValue": "32033",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "651478110005",
//                 "rfrAndComments": []
//             },
//             {
//                 "completedDate": "2009.01.13 12:09:19",
//                 "testResult": "PASSED",
//                 "expiryDate": "2010.01.12",
//                 "odometerValue": "28903",
//                 "odometerUnit": "mi",
//                 "motTestNumber": "174973919075",
//                 "rfrAndComments": []
//             }
//         ]
//     }
// ]