import { ChatMessage } from "@/types";
import React, { useEffect, useRef } from "react";
import ChatMessageFiles from "./ChatMessageFiles";

const ChatBox = ({
  messages,
  chatBoxVariant = "videochat",
}: {
  messages: ChatMessage[];
  chatBoxVariant?: "videochat" | "textchat";
}) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    if (chatBoxRef.current && messages.length > prevMessagesLength.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  return (
    <div
      className={`${
        chatBoxVariant === "videochat" ? "h-52" : "h-[30rem] "
      } overflow-y-auto`}
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
                  <strong className="text-blue-500 mr-2">
                    {e.user || e.username}:
                  </strong>
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
