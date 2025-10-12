const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');


module.exports.registerUser = async (req, res, next) => {
    //
    const errors = validationResult(req);
    // result ko validate karege 
    if( !errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

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