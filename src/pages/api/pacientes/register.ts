import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { PatientModel } from "../../../db/models"; // Adjust the path to your User model
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, tlf, details, doctor, tags } = req.body;

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || session.user.email !== doctor) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  if (!name || !email || !doctor) {
    return res.status(400).json({ error: "Campos requeridos incompletos." });
  }

  await dbConnect();

  try {
    const existingUser = await PatientModel.findOne({
      doctor: session.user.email,
      email,
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Paciente con el mismo mail ya existe" });
    }

    // Create the user
    const user = new PatientModel({ name, email, tlf, details, doctor, tags });
    await user.save();

    return res
      .status(201)
      .json({ message: "Paciente registrado correctamente." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: `Error: ${error}` });
  }
}
