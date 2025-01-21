const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    //read the token fro req.cookies
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please Login");
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        const { _id } = decoded;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error('No User Found');
        }
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(400).send("ERROR: " + err.message);
    }
    // res.send(user);
    //validate the token
    //find the user
}
module.exports = {
    userAuth
};
