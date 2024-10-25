const express=require('express');
const app=express();
//app.get("/user",rh,[rh2,rh3],rh4);

app.get(
    "/user",
    (req,res,next)=>{
        console.log("user1");
        next();
    },
    (req,res,next)=>{
        console.log("user2");
        next();
    },
    (req,res,next)=>{
        console.log("user3");
        next();
    },
    (req,res,next)=>{
        console.log("user4");
        res.send("end!!");
    },

)

app.listen(4000,()=>{
 console.log('listening');
})