import { prop } from "@typegoose/typegoose";

class Visit {
  @prop()
  timestamp: Date;

  @prop()
  utm_params: Record<string, string>;

  @prop()
  entry_point: string;

  @prop()
  device: Record<string, any>;

  @prop()
  os: Record<string, any>;

  @prop()
  browser: Record<string, any>;
}

export class UserAgent {
  @prop()
  _id: string;

  @prop({ type: () => [Visit] })
  visits: Visit[];
}
