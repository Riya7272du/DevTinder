const express = require('express');
const { Chat } = require('../models/chat');
const { userAuth } = require('../middleware/auth');
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    try {
        // Check if a chat already exists between the two users
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName",
        });

        // If no chat exists, create a new one
        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }

        res.status(200).json(chat);
    } catch (err) {
        // console.error("Error fetching or creating chat:", err);
        res.status(500).json({ error: "Failed to fetch or create chat" });
    }
});

module.exports = chatRouter;
