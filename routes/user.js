const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
"use strict";

const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');


router.post('/', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        user.password = undefined;
        user.tokens = undefined;
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async (req, res) => {
    //Login a registered user
    try {
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
})


router.get('/me', auth, async (req, res) => {
    try {
        // View logged in user profile
        const user = req.user;
        user.password = undefined;
        user.tokens = undefined;
        res.send({ user })
    } catch (error) {
        res.status(400).send(error);
    }

})

router.post('/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send({ loggedOut: true })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/me/logoutall', auth, async (req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send({ loggedOutAll: true })
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;