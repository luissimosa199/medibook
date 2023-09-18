import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { PacientModel } from "@/db/models";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await dbConnect();

  try {
    if (req.method === "GET") {
      const users = await PacientModel.find({ doctor: session.user.email }).select("email image name");
      if (!users) {
        return res.status(404).json({ error: "No patients found" });
      }

      return res.status(200).json(users);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
