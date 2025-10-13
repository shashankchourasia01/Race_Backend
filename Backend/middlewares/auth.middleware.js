const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// ye ek middleware jo check karega token valid hai ya nahi
module.exports.authUser = async (req, res, next) => {
    // ye middleware user ko authenticate karega
    // token ko verify karega or token do jagah reta hai headers me or cookies me\
    // npm i cookie-parser ye cookies ke sath interect karta hai humare server mai
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);  // yaha se token milega
    // token ko ab decrypt karege
    if(!token){
        return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    // check if token is blacklisted
    const isBlacklisted = await userModel.findOne({ token: token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Token has been revoked. Please log in again.' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        req.user = user; // ab user ko req me attach kar denge

        return next(); // next middleware pe chale jao
    } catch (err){
        return res.status(401).json({ message: 'Invalid token' });
    }
}