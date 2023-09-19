import { DeletedTimeline } from "./deletedTimelineModel";
import { DeletedUserPhoto } from "./deletedUserPhotosModel";
import { Timeline } from "./timelineModel";
import { getModelForClass } from "@typegoose/typegoose";
import { UserAgent } from "./userAgentModel";
import { Patient } from "./patientModel";

export const TimeLineModel = getModelForClass(Timeline);
export const DeletedTimelineModel = getModelForClass(DeletedTimeline);
export const DeletedUserPhotoModel = getModelForClass(DeletedUserPhoto);
export const UserAgentModel = getModelForClass(UserAgent);
export const PatientModel = getModelForClass(Patient);

// add other models here