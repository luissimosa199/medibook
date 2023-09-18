import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { VideoCallChatModel } from "@/db/models/videoCallChatModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  const room = req.query.room as string;

  if (req.method === "GET") {
    const { limit: limitStr, excludeTimestamps } = req.query;

    const limit = parseInt((limitStr as string) || "10");
    const excludedTimestamps = (excludeTimestamps as string).split(',').map(ts => new Date(Number(ts)).toISOString());
    const chat = await VideoCallChatModel.findById(room);

    if (chat && chat.messages) {
      const filteredMessages = chat.messages.filter(
        (msg) => !excludedTimestamps.includes(msg.timestamp)
      );
      const lastMessages = filteredMessages.slice(-limit);

      res.status(200).json(lastMessages);
    } else {
      res.status(404).json({ error: "Chat not found" });
    }
  } else if (req.method === "POST") {
    const body = JSON.parse(req.body);

    const chat = await VideoCallChatModel.findById(room);

    if (chat) {
      const updateChat = await VideoCallChatModel.findByIdAndUpdate(
        room,
        {
          $push: {
            messages: {
              timestamp: body.timestamp,
              user: body.user,
              message: body.message,
            },
          },
        },
        { new: true }
      ).catch((err) => {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Update Error" });
      });

      if (updateChat) {
        res.status(200).json(updateChat);
      }
    } else {
      const newChat = new VideoCallChatModel({
        _id: room,
        messages: [body.message],
      });
      await newChat.save();
      res.status(201).json(newChat);
    }
  }
}
