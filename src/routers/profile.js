const express=require('express');
const router=express.Router();
const{userAuth}=require("../middleware/auth");
const { validateEditProfileData }=require('../utils/validation');
const cookieParser=require('cookie-parser');
const bcrypt=require('bcrypt');

router.get("/profile/view",userAuth,async(req,res)=>{
    try{
     const user=req.user;
    res.send(user);
    // console.log(cookies);
    // res.send("reading cookie");
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})

router.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
      if(!validateEditProfileData(req)){
        throw new Error("Invalid Edit Request");
      }
      const user=req.user;
    //   console.log(user);

    // await User.findByIdAndUpdate({ _id: userId }, data, {
      //             runValidators: true,
      //         });
      Object.keys(req.body).forEach((key)=>(user[key]=req.body[key]));
    //   console.log(user);
    await user.save();

    //   res.send(` ${user.firstName} your Profile Updated Successfully!!!`)
    res.json({
        message: `${user.firstName}, your Profile Updated Successfully!!!`,
        data: user,
      });
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})

router.patch("/profile/forgetPassword",userAuth, async(req,res)=>{
   try{
     const user=req.user;
      const{ emailId,password}=req.body;
      if(!emailId || !password){
        throw new Error("Email and new password are required");
      } 
      const hashPassword=await bcrypt.hash(password,10);
      user.password=hashPassword;
      await user.save();
      res.json({
        message: `Password for ${user.firstName} has been reset successfully.`,
      });
   }
   catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports=router;


