"use strict";

const User = require('../model/User');
const { validationResult } = require('express-validator');

const createUser = async (req, res) => {
    try {
        const validationErrs = validationResult(req);
        if (!validationErrs.isEmpty()) {
            return res.status(400).send({ error: 'Validation failed for ' + validationErrs.errors[0].param + ' field' })
        }
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        user.password = undefined;
        user.tokens = undefined;
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
}

const login = async (req, res) => {
    try {
        const validationErrs = validationResult(req);
        if (!validationErrs.isEmpty()) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
        }
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
        }
        const token = await user.generateAuthToken()

        user.password = undefined;
        user.tokens = undefined;
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
}


const viewProfile = async (req, res) => {
    try {
        const user = req.user;
        user.password = undefined;
        user.tokens = undefined;
        res.send({ user })
    } catch (error) {
        res.status(400).send(error);
    }

}


const logout = async (req, res) => {
    try {
        const validationErrs = validationResult(req);
        if (!validationErrs.isEmpty()) {
            return res.status(401).send({ error: 'No Authorization header set' })
        }
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send({ loggedOut: true })
    } catch (error) {
        res.status(500).send(error)
    }
}


const logoutAll = async (req, res) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send({ loggedOutAll: true })
    } catch (error) {
        res.status(500).send(error)
    }
}


module.exports = {
    createUser: createUser,
    login: login,
    viewProfile: viewProfile,
    logout: logout,
    logoutAll: logoutAll
}