import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class ProspectsDocs {
  @prop()
  id: string;

  @prop()
  name: string;

  @prop()
  tlf: string;

  @prop()
  email: string;
}

export const ProspectsDocsModel = getModelForClass(ProspectsDocs);
