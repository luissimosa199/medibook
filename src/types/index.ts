import { Dispatch, SetStateAction } from "react";

export interface TimeLineEntryData {
  url: string;
  caption?: string;
  idx: number;
}

export interface TimeLineEntryProps {
  idx: number;
  length: number;
  data: TimeLineEntryData;
}

export interface TimeLineProps {
  _id: string;
  length: number;
  timeline?: TimeLineEntryData[];
  mainText?: string;
  createdAt: string;
  tags: string[];
  authorId: string;
  authorName: string;
  links: InputItem[];
  urlSlug?: string;
}

//

export interface TimelineFormInputs {
  _id: string;
  mainText?: string;
  photo?: TimeLineEntryData[];
  length: number;
  createdAt: string;
  tags: string[];
  authorId: string;
  authorName: string;
  links: InputItem[];

  urlSlug?: string;
}

export interface InputItem {
  value: string;
  caption?: string;
}

export interface User {
  name: string;
  email: string;
  image: string;
  photos: string[];
}

// SOCKETS

export type SocketContextType = {
  name: string;
  setName: (name: string) => void;
  usersInRoom: UserInRoom[];
  messages: ChatMessage[];
  message: string;
  sendMessage: () => void;
  setMessage: (message: string) => void;
  setRoomName: Dispatch<SetStateAction<string | null>>;
  roomName: string | null;
  chatLoaded: boolean;
  duration: number;
};

export type ContextProviderProps = {
  children: React.ReactNode;
  duration: number;
};

export type CallType = {
  isReceivingCall?: boolean;
  from?: string;
  name?: string;
  signal?: any;
};

export type UserInRoom = {
  name: string;
  id: string;
  room: string;
};

export type ChatMessage = {
  username: string;
  message: string;
  timestamp?: Date;
};
