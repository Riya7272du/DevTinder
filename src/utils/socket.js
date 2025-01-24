const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const { timeStamp } = require("console");
const ConnectionRequest = require('../models/connectionRequest');

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId]
            .sort()
            .join("_"))
        .digest("hex");
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"], // Allow required methods
            credentials: true,
        }
    });

    io.on("connection", (socket) => {
        //Handle events
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            // console.log(firstName + "joined " + roomId);
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {

            //save messages to the database
            try {

                const roomId = getSecretRoomId(userId, targetUserId);
                // console.log(firstName + " " + text);

                //check if userId and targetId are friends
                const existingConnectionRequest = await ConnectionRequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId },
                        { fromUserId: targetUserId, toUserId: userId },
                    ],
                    status: "accepted",
                });
                // if (!existingConnectionRequest) {
                //     console.log("Message blocked: Users are not friends.");
                //     return;
                // }
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] },
                })
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    })
                }
                const message = {
                    senderId: userId,
                    text,
                    createdAt: new Date(), // Add `createdAt`
                };

                chat.messages.push(message);
                await chat.save();
                io.to(roomId).emit("messageReceived", { firstName, lastName, text, createdAt: message.createdAt });
            }
            catch (err) {
                console.log(err);
            }

        });

        socket.on("disconnect", () => {

        });

    });
};
module.exports = initializeSocket;