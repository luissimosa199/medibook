import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { ChatMessage, ContextProviderProps, SocketContextType, UserInRoom } from '@/types';
import { useRouter } from 'next/router';
import { saveChat } from '@/utils/saveChat';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {

    const [socket, setSocket] = useState<Socket | null>(null)

    if (!socket) {
        console.log("route not found")
        const newSocket = io();
        setSocket(newSocket)
    }

    const { data: session } = useSession();

    const [name, setName] = useState<string>('');
    const [usersInRoom, setUsersInRoom] = useState<UserInRoom[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState<string>('');
    const [roomName, setRoomName] = useState<string | null>(null);
    const [chatLoaded, setChatLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (socket) {
            // Set up the event listeners
            socket.on('usersInRoom', (usersInRoom) => {
                setUsersInRoom(usersInRoom);
            });

            socket.on('roomMessages', (roomMessages) => {
                setMessages(roomMessages);
            });

            if (roomName && session && session.user) {
                // Join the room
                const roomToJoin = roomName; // Replace with your actual room name
                const userName = session.user.name;   // Replace with the actual user's name
                socket.emit("joinRoomOnConnect", roomToJoin, userName, () => {
                    console.log(`Joined the room: ${roomToJoin}`);
                });
                socket.emit('sendMessage', { room: roomName, message: `${userName} se ha conectado al chat`, username: "ChatBot" })
                setChatLoaded(true)
            }
        }

        return () => {
            if (socket) {
                socket.off('usersInRoom');
                socket.off('roomMessages');
                setChatLoaded(false)
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomName]);


    useEffect(() => {
        if (session && session.user) {
            setName(session?.user?.name as string)
        }
    }, [session]);

    const sendMessage = useCallback(() => {
        if (socket && message.trim()) {
            socket.emit('sendMessage', { room: roomName, message, username: name });
            if (roomName) {
                saveChat({ room: roomName, newMessage: { message, username: name } })
            }
            setMessage(''); // Clear the input after sending
        }
    }, [socket, message, roomName, name, setMessage]);

    return (
        <SocketContext.Provider value={{
            name,
            setName,
            usersInRoom,
            messages,
            sendMessage,
            message,
            setMessage,
            setRoomName,
            roomName,
            chatLoaded
        }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext };
