const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blackListedTokenModel = require('../models/blacklistToken.model');

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // destructure the request body
  const { fullname, email, password, vehicle } = req.body;

  //ek check lagayege ki email already exist to nahi karta
  const isCaptainAlreadyExist = await captainModel.findOne({ email });
  if (isCaptainAlreadyExist) {
    return res
      .status(400)
      .json({ message: "Captain with this email already exists" });
  }

  // hash the password
  const hashedPassword = await captainModel.hashPassword(password);

  // create the captain
  const captain = await captainService.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  // generate token
  const token = captain.generateAuthToken();

  res.status(201).json({ token, captain });
};

module.exports.loginCaptain = async (req, res, next) => {
  // validate request
  const errors = validationResult(req);
  // agar error hai to
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // destructure the request body
  const { email, password } = req.body;

  // find the captain by email
  const captain = await captainModel.findOne({ email }).select("+password");

  // if captain not found
  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // compare password
  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // generate token
  const token = captain.generateAuthToken();

  // token ko generate karne ke baad cookie me set kar dege
  res.cookie("token", token);

  //resonse mai token or captain dono bhej dege
  res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blackListedTokenModel.create({ token });

  res.clearCookie("token");

  res.status(200).json({ message: "Logout successfully" });
};
