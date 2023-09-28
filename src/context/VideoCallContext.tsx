import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
} from "react";
import { Socket, io } from "socket.io-client";
import { useSession } from "next-auth/react";
import {
  ChatMessage,
  ContextProviderProps,
  SocketContextType,
  UserInRoom,
} from "@/types";
import { saveChat } from "@/utils/saveChat";
import { handleNewFileChange, uploadImages } from "@/utils/formHelpers";

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const ContextProvider: React.FC<ContextProviderProps> = ({
  duration,
  chatBoxVariant,
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  if (!socket) {
    console.log("route not found");
    const newSocket = io();
    setSocket(newSocket);
  }

  const { data: session, status } = useSession();

  const [name, setName] = useState<string>("");
  const [usersInRoom, setUsersInRoom] = useState<UserInRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [roomName, setRoomName] = useState<string | null>(null);
  const [chatLoaded, setChatLoaded] = useState<boolean>(false);

  const [files, setFiles] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (socket) {
      // Set up the event listeners
      socket.on("usersInRoom", (usersInRoom) => {
        setUsersInRoom(usersInRoom);
      });

      socket.on("roomMessages", (roomMessages) => {
        setMessages(roomMessages);
      });

      if (roomName && status !== "loading") {
        const roomToJoin = roomName;
        const userName = session?.user?.name || "Invitado";
        socket.emit("joinRoomOnConnect", roomToJoin, userName, () => {
          console.log(`Joined the room: ${roomToJoin}`);
        });
        socket.emit("sendMessage", {
          room: roomName,
          message: `${userName} se ha conectado al chat`,
          username: "ChatBot",
        });
        setChatLoaded(true);
      }
    }

    return () => {
      if (socket) {
        socket.off("usersInRoom");
        socket.off("roomMessages");
        setChatLoaded(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName, status]);

  useEffect(() => {
    if (session && session.user) {
      setName(session?.user?.name as string);
    } else {
      setName("Invitado");
    }
  }, [session]);

  const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    setSubmitBtnDisabled(true);
    const newPreviews = await handleNewFileChange(event);
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

    try {
      const uploadedUrls = await uploadImages(event);

      // If you want to set the URLs to some state
      setFiles((prevFiles) => [...prevFiles, ...(uploadedUrls as string[])]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }

    setSubmitBtnDisabled(false);
    event.target.value = "";
  };

  const sendMessage = useCallback(() => {
    let chatContent: ChatMessage = {
      room: roomName as string,
      username: name,
      message: message,
      files: files.map((e) => {
        return { url: e, type: e.slice(-3) };
      }),
    };

    if (
      socket &&
      (chatContent.message?.trim() !== "" ||
        (chatContent.files && chatContent.files.length > 0))
    ) {
      socket.emit("sendMessage", chatContent);

      if (roomName) {
        saveChat({ room: roomName, newMessage: chatContent });
      }

      setMessage("");
      setFiles([]);
      setPreviews([]);
    }
  }, [name, files, message, socket, roomName]);

  return (
    <SocketContext.Provider
      value={{
        name,
        setName,
        usersInRoom,
        messages,
        sendMessage,
        message,
        setMessage,
        setRoomName,
        roomName,
        chatLoaded,
        duration,
        handleUploadImages,
        files,
        previews,
        submitBtnDisabled,
        chatBoxVariant,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
