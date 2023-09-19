import { prop } from "@typegoose/typegoose";

export class Patient {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  email: string;

  @prop()
  tlf?: string;

  @prop()
  details?: string;

  @prop()
  image?: string;

  @prop()
  photos?: string[];

  @prop({ required: true })
  doctor: string;
}
