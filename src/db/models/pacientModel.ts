import { prop } from "@typegoose/typegoose";

export class Pacient {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  email: string;

  @prop()
  tlf?: string;

  @prop()
  details?: string;

  @prop({ required: true })
  doctor: string;
}
