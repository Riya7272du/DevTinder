const express=require('express');

const connectDB=require("./config/database");
const app=express();
const User=require('./models/user');
// app.use("/test",(req,res)=>{
//     res.send("hello from serverdrrv43");
// })
// app.use("/hello/h1",(req,res)=>{
//     res.send("helloh1");
// })
// app.use("/hello",(req,res)=>{
//     res.send("hello");
// })

// app.use("/",(req,res)=>{
//     res.send("hello from serve1");
// })

//hardcoring the data
app.post("/signup",async(req,res)=>{
    const user=new User({
        firstName:"Shreyasi",
        lastname:"Saha",
        emailId:"shreyasi@gmail.com",
        password:"shreyasi@123",
    });
    try{
    await user.save();
    res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("error saving the user:" + err.message);
    }
})

connectDB().then(()=>{
    console.log("Database connection established!!!");
})
.catch((err)=>{
    console.log("Database connection cannot be established!!!");
})

app.listen(4000,()=>{
    console.log("listening!!!");
})