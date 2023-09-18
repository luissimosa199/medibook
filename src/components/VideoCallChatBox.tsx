import { SocketContext } from '@/context/VideoCallContext';
import React, { useContext } from 'react'
import ChatBox from './ChatBox';

const VideoCallChatBox = () => {

    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("You must use this component within a <ContextProvider>");
    }

    const { messages, message, sendMessage, setMessage } = context


    return (
        <div className="flex flex-col h-full">

            <ChatBox messages={messages} />

            <form
                className="flex items-center w-full justify-center"
            >
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-grow p-2 border rounded-md focus:outline-none focus:border-blue-500"
                />

                <button
                    onClick={(e) => { e.preventDefault(); sendMessage() }}
                    type="submit"
                    className="ml-2 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                >
                    Enviar
                </button>
            </form>
        </div>
    )
}

export default VideoCallChatBox