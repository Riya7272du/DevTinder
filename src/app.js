const express=require('express');
const app=express();

app.use("/test",(req,res)=>{
    res.send("hello from serverdrrv43");
})
app.use("/hello",(req,res)=>{
    res.send("hello");
})
app.use("/",(req,res)=>{
    res.send("hello from serve1");
})
app.listen(4000,()=>{
    console.log("listening!!!");
})