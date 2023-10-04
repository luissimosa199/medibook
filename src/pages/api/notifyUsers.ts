// pages/api/notifyUsers.ts

import { VideoCallChatModel } from "@/db/models/videoCallChatModel";
import { sendNotificationToUser } from "@/utils/sendNotificationToUser";
import { NextApiRequest, NextApiResponse } from "next";
import "../../utils/webPushSetup";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { channelName } = req.body;

  if (!channelName) {
    return res.status(400).json({ error: "Missing channelName" });
  }

  try {
    // Fetch users subscribed to this chat
    const chat = await VideoCallChatModel.findOne({ _id: channelName });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const subscribers = chat.subscribedForNotifications || [];

    // Send notifications to those users
    for (const userId of subscribers) {
      await sendNotificationToUser(userId, "Quieren chatear con vos!");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("notifyUsers", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: (error as unknown as { message: string }).message,
    });
  }
}
