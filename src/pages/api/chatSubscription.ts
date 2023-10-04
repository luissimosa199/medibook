import dbConnect from "@/db/dbConnect";
import { UserAgentModel } from "@/db/models";
import { VideoCallChatModel } from "@/db/models/videoCallChatModel";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { user_agent_id, subscription, conversationId } = req.body;

  if (!user_agent_id || !subscription || !conversationId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await dbConnect();

    // Update the UserAgent with the subscription
    await UserAgentModel.findByIdAndUpdate(user_agent_id, {
      PushSubscription: subscription,
    });

    // Add the user_agent_id to the VideoCallChat's subscribedForNotifications list
    await VideoCallChatModel.findByIdAndUpdate(conversationId, {
      $addToSet: { subscribedForNotifications: user_agent_id },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
