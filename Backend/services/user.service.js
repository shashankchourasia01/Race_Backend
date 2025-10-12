// ye function bas user ko create karne ka logic hai or kuch chiz check karega 
const userModel = require("../models/user.model");

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password,
  // ye 4 chize ye function accept karega as a object
}) => {
  if (!firstname || !email || !password) {
    throw new Error("Required fields are missing");
  }
  const user = userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });

  return user;
};
