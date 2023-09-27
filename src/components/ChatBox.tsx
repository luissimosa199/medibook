import { ChatMessage } from "@/types";
import React, { useEffect, useRef } from "react";
import ChatMessageFiles from "./ChatMessageFiles";

const ChatBox = ({ messages }: { messages: ChatMessage[] }) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="h-4/5 overflow-y-auto mb-1"
      ref={chatBoxRef}
    >
      <div className="flex flex-col items-center justify-center px-2">
        {messages &&
          messages.map((e, i) => {
            // Check if the message has files
            const hasFiles = e.files && e.files.length > 0;

            return (
              <div
                key={i}
                className="bg-white w-full"
              >
                <div className="flex items-center">
                  <strong className="text-blue-500 mr-2">{e.username}:</strong>
                  <p>{e.message}</p>
                </div>

                {hasFiles && <ChatMessageFiles files={e.files} />}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ChatBox;
