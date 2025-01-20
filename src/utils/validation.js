const validator = require('validator');

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  // Validate firstName and lastName
  if (!firstName || !lastName) {
    throw new Error("First name or last name is missing or invalid");
  }
  // Validate email
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
  // Validate password strength
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a stronger password");
  }
};

const validateEditProfileData=async(req)=>{
   const allowedEditFields=[
    "fisrtName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];
  const isEditAllowed=Object.keys(req.body).every(field=>
    allowedEditFields.includes(field));
    return isEditAllowed;
};

module.exports = {validateSignUpData,validateEditProfileData};
