"use strict";

const User = require('../model/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

/** Create a User */
const createUser = async (req, res) => {
    try {
        // Set user role + determine if admin or basic user. If admin, hash req.body.secret and compare it to hashed secret in .env file
        req.body.role = 'basic'; 
        if (req.body.secret) {           
            const isMatch = await bcrypt.compare(req.body.secret, process.env.ADMIN_SECRET);
            if (!isMatch) throw new Error('Incorrect secret')
            req.body.role = 'admin';
        }
        // Ensure email doesn't already exist
        const alreadyExists = await User.findOne({email: req.body.email})
        if (alreadyExists) throw new Error('Email already exists')
        // Create user
        const user = new User(req.body)
        await user.save()
        // Generate JWT
        const token = await user.generateAuthToken()
        // Return user object (but avoid returning password or previous tokens)
        user.password = undefined; 
        user.tokens = undefined;
        res.status(201).send({ user, token })
    } catch (err) {
        return res.status(400).send({error: err.message})
    }
}

/** Login */
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) throw new Error('Login failed! Check authentication credentials')
        const token = await user.generateAuthToken()
        user.password = undefined;
        user.tokens = undefined;
        res.send({ user, token })
    } catch (err) {
        res.status(401).send({error: err.message})
    }
}

/** View Current User's Profile */
const viewProfile = async (req, res) => {
    try {
        const user = req.user;
        user.password = undefined;
        user.tokens = undefined;
        res.send({ user })
    } catch (err) {
        res.status(400).send({error: err.message});
    }
}

/** Logout of single Session  */
const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send({ loggedOut: true })
    } catch (err) {
        res.status(400).send({error: 'Logout attempt failed. Please try again'});
    }
}

/** Logout all Sessions  */
const logoutAll = async (req, res) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send({ loggedOutAll: true })
    } catch (err) {
        res.status(400).send({error: 'Logout attempt failed. Please try again'});
    }
}

module.exports = {
    createUser: createUser,
    login: login,
    viewProfile: viewProfile,
    logout: logout,
    logoutAll: logoutAll
}