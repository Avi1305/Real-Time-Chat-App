import TryCatch from "../config/TryCatch.js";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/chat.js";

export const createNewChat = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const  userId  = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      res.status(400).json({
        message: "Other userid is required",
      });
    }
    const existingChat = await Chat.findOne({
      user: { $all: [userId, otherUserId], $size: 2 },
    });

    if(existingChat){
        res.json({
            message:"Chat already exist",
            chatId: existingChat._id
        })
        return;
    }

    const newChat = await Chat.create({
         users:[userId,otherUserId]
    })

    res.status(201).json({
        message:"New chat created",
        chatId:newChat._id
    })
  },
);
