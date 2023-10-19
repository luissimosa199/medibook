import dbConnect from "@/db/dbConnect";
import { ProspectsDocsModel } from "@/db/models/PropsectsDocsModel";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }
  await dbConnect();

  const formData = JSON.parse(req.body);

  const newFormEntry = new ProspectsDocsModel({
    id: formData.id,
    name: formData.name,
    tlf: formData.tlf,
    email: formData.email,
  });

  try {
    await newFormEntry.save();

    res.status(200).json({ success: true, data: formData });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
