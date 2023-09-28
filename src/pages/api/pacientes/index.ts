import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { DeletedPatientModel, PatientModel } from "@/db/models";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await dbConnect();
  const { id } = req.query;

  let queryId;
  if (mongoose.Types.ObjectId.isValid(id as string)) {
    queryId = new mongoose.Types.ObjectId(id as string);
  } else {
    queryId = id as string;
  }

  try {
    if (req.method === "GET") {
      if (id) {
        const patient = await PatientModel.findOne({ _id: queryId });
        return res.status(200).json(patient);
      }

      const patients = await PatientModel.find({ doctor: session.user.email })
        .select("email name image tags isArchived")
        .sort({ createdAt: -1 });
      if (!patients) {
        return res.status(404).json({ error: "No patients found" });
      }
      return res.status(200).json(patients);
    } else if (req.method === "POST") {
      // migrar register?
      console.log("POST");
    } else if (req.method === "DELETE") {
      const patient = await PatientModel.findOne({ _id: queryId });
      const patientObject = patient?.toObject();

      const saveDeletedPatient = new DeletedPatientModel({
        ...patientObject,
        deletedAt: new Date(),
      });

      await saveDeletedPatient.save();

      const deletedPatient = await PatientModel.findOneAndRemove({
        _id: queryId,
      });

      if (deletedPatient) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Patient not found" });
      }
    } else if (req.method === "PUT") {
      try {
        const updateData = req.body;

        const updatedPatient = await PatientModel.findOneAndUpdate(
          { _id: queryId },
          updateData,
          {
            new: true,
          }
        );

        if (updatedPatient) {
          res.status(200).json(updatedPatient);
        } else {
          res.status(404).json({ message: "Patient not found" });
        }
      } catch (error) {
        res
          .status(500)
          .json({ message: "Internal server error", error: error });
      }
    } else if (req.method === "PATCH") {
      try {
        const patient = await PatientModel.findById(queryId);

        if (!patient) {
          return res.status(404).json({ message: "Patient not found" });
        }

        const newIsArchivedStatus = patient.isArchived
          ? !patient.isArchived
          : true;

        const updatedPatient = await PatientModel.findOneAndUpdate(
          { _id: queryId },
          { isArchived: newIsArchivedStatus },
          {
            new: true,
          }
        );

        res.status(200).json(updatedPatient);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Internal server error", error: error });
      }
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
