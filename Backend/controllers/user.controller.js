const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');


module.exports.registerUser = async (req, res, next) => {
    //
    const errors = validationResult(req);
    // result ko validate karege 
    if( !errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    // ab hume check lagana hai ki email already exist to nahi karta
    const isUserAlreadyExist = await userModel.findOne({ email });
    if(isUserAlreadyExist){
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    // ab hume password ko hash karna hai kuki db mai password plain text me nahi rakhna chahie
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
    });

    // ab jo user create hoga ussey hume token generate karana hai 
    const token = user.generateAuthToken();
    res.status(201).json({ user, token });
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    // result ko validate karege 
    if( !errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    // ab hume email or password lena hai
    const { email, password } = req.body;
    
    // ab hume check karana hai ki email db me hai ya nahi
    const user = await userModel.findOne({ email }).select('+password');
    if(!user){
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    // user jo login hua uska password match karana hai
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ab jo user login hoga ussey hume token generate karana hai
     const token = user.generateAuthToken();

     res.cookie('token', token);

     res.status(200).json({ user, token });
}

module.exports.getUserProfile = async (req, res, next) => {
    // ye function user ka profile dega
    // but iske liye hume authentication middleware banana padega
    res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    await blacklistTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out successfully' });
}