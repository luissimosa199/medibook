import { modelOptions, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: 0,
  },
})
export class Patient {
  @prop({ default: () => nanoid(9) })
  _id: string | ObjectId;

  @prop({ required: true })
  name: string;

  @prop()
  email?: string;

  @prop()
  tlf?: string;

  @prop()
  details?: string;

  @prop()
  image?: string;

  @prop()
  tags?: string[];

  @prop()
  photos?: string[];

  @prop({ required: true })
  doctor: string;
}
