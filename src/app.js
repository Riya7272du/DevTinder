const express = require('express');
const { validateSignUpData } = require('./utils/validation');
const connectDB = require("./../config/database");
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/requests");
const userRouter = require("./routers/user");
// const messageRouter=require("./routers/mesage")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
// app.use("/", messageRouter);

connectDB().then(() => {
    console.log("Database connection established!!!");
})
    .catch((err) => {
        console.log("Database connection cannot be established!!!");
    })

app.listen(4000, () => {
    console.log("listening!!!");
})