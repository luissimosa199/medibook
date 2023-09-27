import { ChatMessage } from "@/types";

interface SaveChatParams {
  room: string;
  newMessage: ChatMessage;
}

export async function saveChat({ room, newMessage }: SaveChatParams) {
  try {
    const response = await fetch(`/api/chat/${room}`, {
      method: "POST",
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        user: newMessage.username,
        message: newMessage.message,
        files: newMessage.files, // send the files array
      }),
    });

    if (response.ok) {
      console.log("Message saved successfully", new Date());
    } else {
      const responseData = await response.json();
      console.error("Error saving message:", responseData);
    }
  } catch (error: any) {
    console.error("Error sending POST request:", error.message);
  }
}
