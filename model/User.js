"use strict";

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
        lowercase: true,
		max: 255
	},
	email: {
		type: String,
		required: true,
		min: 6,
		max: 255,
		unique: true,
        lowercase: true
	},
	password: {
		type: String,
		required: true,
		max: 1024,
		min: 6
	},
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    role: {
        type: String,
        default: "basic",
        enum: ["basic", "admin"]
    }
});

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY, { expiresIn: '1h' })
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({email}).exec();   
    if (!user) return false
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) return false
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User;