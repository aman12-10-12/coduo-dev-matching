const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");
const mongoose = require("mongoose");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    if (userId.toString() === targetUserId) {
      return res.status(400).json({ error: "Cannot chat with yourself" });
    }

    // 🔐 2. Check if users are friends (connection accepted)
    const connection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
      ],
    });

    if (!connection) {
      return res.status(403).json({
        error: "You can only chat with your connections",
      });
    }


  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err.message);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

module.exports = chatRouter;