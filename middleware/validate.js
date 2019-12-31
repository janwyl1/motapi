"use strict";
const { param, header, check } = require('express-validator');

const isValidDate = (value) => {
    const regex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
    return regex.test(value);
}
const isValidReg = (value) => {
    const regex = /(^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$)|(^[A-Z][0-9]{1,3}\s?[A-Z]{3}$)|(^[A-Z]{3}\s?[0-9]{1,3}[A-Z]$)|(^[0-9]{1,4}\s?[A-Z]{1,2}$)|(^[0-9]{1,3}\s?[A-Z]{1,3}$)|(^[A-Z]{1,2}\s?[0-9]{1,4}$)|(^[A-Z]{1,3}\s?[0-9]{1,3}$)/;
    return regex.test(value);
}

const validate = (method) => {
    switch (method) {
        case 'appt':
            {
                return [
                    check('apptDate', 'Invalid appointment date').custom(isValidDate).trim().stripLow(),
                    check('customer.name', 'Invalid name').isString().trim().escape().stripLow(),
                    check('customer.email', 'Invalid email').isEmail().normalizeEmail().stripLow(),
                    check('customer.phone', 'Invalid phone number').isString().trim().escape().stripLow(),
                    check('customer.altPhone', 'Invalid alt phone number').optional("nullable").isString().trim().escape().stripLow(),
                    check('car.registration', 'Invalid car registration').custom(isValidReg).trim().escape().stripLow(),
                    check('car.make', 'Invalid make').isString().optional().trim().escape().stripLow(),
                    check('car.model', 'Invalid model').isString().optional().trim().escape().stripLow(),
                    check('car.firstUsed', 'Invalid first used date').optional().isString().trim().escape().stripLow(),
                    check('car.fuelType', 'Invalid fuel type').optional().isString().trim().escape().stripLow(),
                    check('car.color', 'Invalid color').optional().isString().trim().escape().stripLow(),
                    check('car.vehicleId', 'Invalid vehicle id').optional().isString().trim().escape().stripLow(),
                    check('car.regDate', 'Invalid registration date').optional().isString().trim().escape().stripLow(),
                    check('car.manufacDate', 'Invalid manufacture date').optional().isString().trim().escape().stripLow(),
                    check('car.engineSize', 'Invalid engine size').optional().isNumeric().trim().escape().stripLow(),
                    check('car.motTests.*.completedDate', 'Invalid completed date').optional().isString().trim().escape().stripLow(),
                    check('car.motTests.*.testResult', 'Invalid test result').optional().isString().trim().escape().stripLow(),
                    check('car.motTests.*.expiryDate', 'Invalid expiry date').optional().isString().trim().escape().stripLow(),
                    check('car.motTests.*.odometerValue', 'Invalid odometer value').optional().isString().trim().escape().stripLow(),
                    check('car.motTests.*.odometerUnit', 'Invalid odometer unit').optional().isString().trim().escape().stripLow(),
                    check('car.motTests.*.ododometerResultType', 'Invalid odometer result tyle').optional().isString().trim().escape().stripLow(),
                    check('car.motTests.*.motTestNumber', 'Invalid MOT test number').optional().isString().trim().escape().stripLow(),
                    check('car.motTests.*.rfrAndComments.*.text', 'Invalid MOT test number').optional().isString().trim().escape().stripLow(),
                    check('car.motTests.*.rfrAndComments.*.type', 'Invalid MOT test number').optional().isString().trim().escape().stripLow(),
                    check('car.motTests.*.rfrAndComments.*.dangerous', 'Invalid MOT test number').optional().isBoolean().trim().escape().stripLow(),
                ]
            }
        case 'id':
            {
                return [
                    param('id', 'Invalid id').isString().trim().escape().stripLow()
                ]
            }
        case 'reg': 
        {
            return [
                param('reg', 'Invalid Vehicle Registration').isString().trim().isLength({max: 7}).escape().stripLow()
            ]
        }
        case 'user':
            {
                return [
                    check('name', 'Invalid name').isString().trim().escape().stripLow().exists({checkFalsy: true}), //.checkFalsy: if true, fields with falsy values (eg "", 0, false, null) will also not exist,
                    check('email', 'Invalid email address').isEmail().normalizeEmail().exists({checkFalsy: true}),
                    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }).trim(),
                    check('secret', 'Invalid Secret').isString().optional(),
                    check('role', 'You cant manually set a role').isEmpty({checkFalsy: true})
                ]
            }   
        case 'login':
            {
                return [
                    check('email').isEmail().normalizeEmail(),
                    check('password').isLength({ min: 6 }).trim()
                ]
            }

        case 'authHeader':
            {
                return [
                    header('Authorization').exists()
                ]
            }

    }
}

module.exports = validate