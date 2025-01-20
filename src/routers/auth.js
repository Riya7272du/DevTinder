const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('../utils/validation');
const jwt = require("jsonwebtoken");
const router = express.Router();


router.post("/signup", async (req, res) => {
    console.log(req.body);

    try {
        //validation of data
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        //  const {password}=req.body;
        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000), httpOnly: true });

        res.send({ message: "User added successfully", data: savedUser });
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        // const isPasswordValid=await bcrypt.compare(password,user.password);
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            //Create a JWT token
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000), httpOnly: true });
            res.send(user);
        }
        else {
            throw new Error("Invalid Credentials");
        }
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

router.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Succesful!!")
})
module.exports = router;