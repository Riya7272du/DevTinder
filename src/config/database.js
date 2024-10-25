const mongoose=require('mongoose');

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://singhalriya912:Riya7272%40@devtinder.lqeye.mongodb.net/?retryWrites=true&w=majority&appName=DevTinder");
};

module.exports=connectDB;
// connectDB().then(()=>{
//     console.log("database connection established...");
// }).catch(err=>{
//     console.log("database cannot be connected");
// })

