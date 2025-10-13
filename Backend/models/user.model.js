const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
    firstname: {
        type: String,
        required: true,
        minlength: [3, 'First name must be at least 3 characters long'],
    },
    lastname: {
        type: String,
        minlength: [3, 'Last name must be at least 3 characters long'],
    }
},
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false, // do not return password field by default
    },
    //use for live location tracking for captain(rider)
    socketId: {
        type: String,
    },
})

//some method created for user schema

// generate token for user
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id}, process.env.JWT_SECRET, { expiresIn: '1d' } );
    return token;
}

// compare password method
userSchema.methods.comparePassword = async function (password) {
    if (!this.password) {
        throw new Error('Password not set for this user');
    }
    return await bcrypt.compare(password, this.password);
}

// hash password before saving user
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}


// create user model
const userModel = mongoose.model('user', userSchema);

module.exports = userModel;  // ab isko require karege controller me