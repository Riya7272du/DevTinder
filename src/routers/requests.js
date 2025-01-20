const express=require('express');
const router=express.Router();
const{userAuth}=require("../middleware/auth");
const ConnectionRequest=require("../models/connectionRequest");
const User=require("../models/user");
router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status; 

        // "interested" and "ignored" are the statuses for left swipe or right swipe
        const Allowedstatus = ["interested", "ignored"];
        if (!Allowedstatus.includes(status)) {
            return res
              .status(400)
              .json({
                message: "Invalid status type: " + status
              }); 
        }
        
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        // if there is an existing connection request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],  
        });

        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection Request Already Exists!!!" });
        }

        const data = await connectionRequest.save();
        res.json({
            data,
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
        });
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


router.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
    const loggedInUser=req.user;
    const {status,requestId}=req.params;
    const Allowedstatus=["accepted","rejected"];
    if(!Allowedstatus.includes(status)){
        return res.status(400).json({message:"status not allowed"});
    }
    
    const connectionRequest=await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested",
    })
    if(!connectionRequest){
        return res.status(404).json({message:"Connection Request not found"});
    }
    connectionRequest.status=status;  
    const data=await connectionRequest.save(); 
     res.json({message:"Connection Request"+ status,data});
  }
  catch(err){
    res.status(400).send("ERROR: "+ err.message);
  }
})
module.exports=router;
