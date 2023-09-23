import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

export class Message {
  @prop()
  timestamp: string;

  @prop()
  user: string;

  @prop()
  message: string;
}

class CurrentCall {
  @prop()
  duration: number;

  @prop()
  initTime: Date;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class VideoCallChat {
  @prop()
  _id: string;

  @prop()
  url: string;

  @prop({ default: () => new Date() })
  createdAt: Date;

  @prop({ default: () => new Date() })
  updatedAt: Date;

  @prop()
  currentCall: CurrentCall;

  @prop()
  messages: Message[];
}

export const VideoCallChatModel = getModelForClass(VideoCallChat);
