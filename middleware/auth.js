"use strict";

const jwt = require('jsonwebtoken')
const User = require('../model/User')

const requiresLogin = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        if (!token || !data) throw new Error()
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) throw new Error()
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}

const isAdmin = (req, res, next) => {
    if (req.user.role === "admin") {
        next();
    } else {
        res.status(401).send({ error: "Not permitted to perform this action"})
    }
}

module.exports = {
    requiresLogin: requiresLogin,
    isAdmin: isAdmin
}