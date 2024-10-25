const express=require('express');

const connectDB=require("./config/database");
const app=express();
const User=require('./models/user');

app.use(express.json());

//dynamic post
app.post("/signup",async(req,res)=>{
    console.log(req.body);
    const user=new User(req.body);
    
    try{
    await user.save();
    res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("error saving the user:" + err.message);
    }
})

//user by email
app.get("/user",async(req,res)=>{
    const userEmail=req.body.emailId;
    try{
        const users=await User.find({emailId:userEmail});
        if(users.length===0){
            res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
});

app.get("/feed",async(req,res)=>{
    try{
        const users=await User.find({});
        res.send(users); 
    }
    catch(err){
        res.status(400).send("error");
    }
})

app.delete("/user",async(req,res)=>{
    const userId=req.body.userId;
    try{
        const user= await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
});
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_FIELD = ["photoUrl", "about", "gender", "age", "skills"];

        // Ensure every key in the data object is in the ALLOWED_FIELD array
        const isUpdateAllowed = Object.keys(data).every((k) => {
            return ALLOWED_FIELD.includes(k); // Add 'return' here
        });

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        if(data?.skills.length>10){
            throw new Error("skills cannot be more than 10");
        }

        await User.findByIdAndUpdate({ _id: userId }, data, {
            runValidators: true,
        });

        console.log(data);
        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("Update failed: " + err.message);
    }
});

connectDB().then(()=>{
    console.log("Database connection established!!!");
})
.catch((err)=>{
    console.log("Database connection cannot be established!!!");
})

app.listen(4000,()=>{
    console.log("listening!!!");
})