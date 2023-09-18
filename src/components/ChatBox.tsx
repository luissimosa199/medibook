import { ChatMessage } from '@/types';
import React, { useEffect, useRef } from 'react';

const ChatBox = ({ messages }: { messages: ChatMessage[] }) => {
    const chatBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="h-4/5 flex-shrink-0 overflow-y-auto mb-1" ref={chatBoxRef}>
            <div className="flex flex-col items-center justify-center">

                {messages && messages.map((e, i) => {
                    return (
                        <p className="bg-white w-full" key={i}>
                            <strong className="text-blue-500">{e.username}:</strong> {e.message}
                        </p>
                    )
                })}
            </div>
        </div>
    );
}

export default ChatBox;
