const express=require('express');
const { userAuth } = require('../middleware/auth');
const router=express.Router();
const connectionRequest=require("../models/connectionRequest");
const ConnectionRequest = require('../models/connectionRequest');
const Users = require('../models/user');

//Get all the pending coonection request for thr logged in user
// router.get('/user/:id', userAuth, async (req, res) => {
//   const userId = req.params.id;

//   try {
//       const user = await Users.findById(userId).select("firstName lastName"); // Fetch only firstName and lastName
//       if (!user) {
//           return res.status(404).json({ error: 'User not found' });
//       }
//       res.status(200).json(user);
//   } catch (error) {
//       console.error("Error fetching user:", error.message);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });



router.get("/user/requests/received",userAuth,async(req,res)=>{
   try{
      const  loggedInUser=req.user;
      const connectionRequests = await connectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested",
      })
      .populate("fromUserId",["firstName","lastName","about","gender","age","skills","photoUrl"]);
      res.json({message:"Data fetch Successfully",
        data:connectionRequests,
      })
   }
   catch(err){
     res.status(400).send("ERROR: "+ err.message);
   }
});

router.get("/user/connection",userAuth,async(req,res)=>{
    try{
       const loggedInUser=req.user;
       const connectionRequests=await ConnectionRequest.find({
        $or:[
            {toUserId:loggedInUser._id, status:"accepted"},
            {fromUserId:loggedInUser._id, status:"accepted"},
        ],
       })
       .populate("fromUserId",["firstName","lastName","photoUrl","about","skills","age","gender"])
       .populate("toUserId",["firstName","lastName","photoUrl","about","skills","age","gender"]);

       const data=connectionRequests.map((row)=> {
        if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
       }); 

       res.json({data:data});
    }
    catch(err){
      res.status(400).send("ERROR: "+ err.message);
    }
 });

 router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50 ? 50:limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await Users.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(["firstName", "lastName","about","age","gender","photoUrl"])
      .skip(skip) // Pass skip here
      .limit(limit); // Pass limit here

    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
module.exports=router;