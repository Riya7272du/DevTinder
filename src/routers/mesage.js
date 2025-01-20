// const express = require('express');
// const Message = require('../models/message');
// const router = express.Router();
// const { userAuth } = require("../middleware/auth");

// router.get('/chat/messages/:userId', userAuth, async (req, res) => {
//     const userId = req.params.userId;
//     const currentUserId = req.user._id;
//     try {
//         const messages = await Message.find({
//             $or: [
//                 { senderId: currentUserId, receiverId: userId },
//                 { senderId: userId, receiverId: currentUserId }
//             ]
//         })
//         .sort({ createdAt: 1 })
//         .populate("senderId", ["_id", "firstName", "lastName"]) // Only include necessary fields
//         .populate("receiverId", ["_id", "firstName", "lastName"]); // Only include necessary fields

//         // Map the messages to match your desired structure
//         const formattedMessages = messages.map(message => ({
//             _id: message._id,
//             senderId: {
//                 _id: message.senderId._id,
//                 firstName: message.senderId.firstName,
//                 lastName: message.senderId.lastName,
//             },
//             receiverId: {
//                 _id: message.receiverId._id,
//                 firstName: message.receiverId.firstName,
//                 lastName: message.receiverId.lastName,
//             },
//             content: message.content,
//             createdAt: message.createdAt,
//         }));

//         res.status(200).json(formattedMessages);
//     } catch (error) {
//         console.error("Error fetching messages:", error.message); // Log error message
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
// });

// // Send a message
// router.post('/chat/send', userAuth, async (req, res) => {
//     const { receiverId, content } = req.body;
//     const senderId = req.user._id;

//     if (!receiverId || !content) {
//         return res.status(400).json({ error: 'Receiver ID and content are required' });
//     }

//     try {
//         const newMessage = new Message({ senderId, receiverId, content });
//         await newMessage.save();
//         // Populate the new message to return user details in response
//         const populatedMessage = await Message.findById(newMessage._id)
//             .populate("senderId", ["_id", "firstName", "lastName"])
//             .populate("receiverId", ["_id", "firstName", "lastName"]);

//         res.status(201).json({
//             _id: populatedMessage._id,
//             senderId: {
//                 _id: populatedMessage.senderId._id,
//                 firstName: populatedMessage.senderId.firstName,
//                 lastName: populatedMessage.senderId.lastName,
//             },
//             receiverId: {
//                 _id: populatedMessage.receiverId._id,
//                 firstName: populatedMessage.receiverId.firstName,
//                 lastName: populatedMessage.receiverId.lastName,
//             },
//             content: populatedMessage.content,
//             createdAt: populatedMessage.createdAt,
//         });
//     } catch (error) {
//         console.error("Error sending message:", error.message); // Log error message
//         res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
// });

// module.exports = router;
