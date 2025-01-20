// // models/message.js
// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//     senderId: { type: mongoose.Schema.Types.ObjectId,  ref:"User",required: true },
//     receiverId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
//     content: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// const Message = mongoose.model('Message', messageSchema);

// module.exports = Message;
