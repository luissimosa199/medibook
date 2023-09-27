import React, { useContext, useEffect } from "react";
import VideoCallChatBox from "./VideoCallChatBox";
import { SocketContext } from "@/context/VideoCallContext";

const ChatOnlyPage = ({ channelName }: { channelName: string }) => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("You must use this component within a <ContextProvider>");
  }

  const { setRoomName, usersInRoom } = context;

  useEffect(() => {
    setRoomName(channelName as string);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="border-2 w-full p-2 rounded-md shadow-md bg-gray-100 flex gap-2 items-center">
        <h3 className="text-lg font-semibold">Integrantes:</h3>
        <ul className="flex gap-2 items-center">
          {usersInRoom.map((user, index) => (
            <li
              key={index}
              className="flex items-center"
            >
              <span className="bg-blue-200 text-blue-800 rounded-full px-4 py-0.5 text-sm">
                {user.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <VideoCallChatBox />
    </div>
  );
};

export default ChatOnlyPage;
