"use client";

import { createOrGetChannel, getStreamUserToken } from "@/lib/actions/stream";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Channel, StreamChat } from "stream-chat";

interface UserProps {
  id: string;
}

interface StreamChatProps {
  otherUser: UserProps;
}

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  timestamp: Date;
  user_id: string;
}

export default function StreamChatInterface({ otherUser }: StreamChatProps) {
  const [loading, setloading] = useState(true);
  const [currentUserId, setcurrentUserId] = useState<string>("");
  const [messages, setmessages] = useState<Message[]>([]);
  const [newMessage, setnewMessage] = useState("");
  const [client, setclient] = useState<StreamChat | null>(null);
  const [channel, setchannel] = useState<Channel | null>(null);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function initializeChat() {
      try {
        const { token, userId, userName, userImage } =
          await getStreamUserToken();
        setcurrentUserId(userId);

        const chatClient = StreamChat.getInstance(
          process.env.NEXT_PUBLIC_STREAM_API_KEY!
        );
        await chatClient.connectUser(
          { id: userId, name: userName, image: userImage },
          token
        );

        const { channelType, channelId } = await createOrGetChannel(
          otherUser.id
        );
        const chatChannel = chatClient.channel(channelType, channelId);
        await chatChannel.watch();

        const state = await chatChannel.query({ messages: { limit: 50 } });
        const convertedMessages: Message[] = state.messages.map((msg) => ({
          id: msg.id,
          text: msg.text || "",
          sender: msg.user?.id === userId ? "me" : "other",
          timestamp: new Date(msg.created_at || new Date()),
          user_id: msg.user?.id || "",
        }));

        setmessages(convertedMessages);

        chatChannel.on("message.new", (event) => {
          const msg = event.message;
          if (!msg) return;
          setmessages((prev) => [
            ...prev,
            {
              id: msg.id,
              text: msg.text || "",
              sender: msg.user?.id === userId ? "me" : "other",
              timestamp: new Date(msg.created_at || new Date()),
              user_id: msg.user?.id || "",
            },
          ]);
        });

        setclient(chatClient);
        setchannel(chatChannel);
      } catch {
        router.push("/bookings");
      } finally {
        setloading(false);
      }
    }

    if (otherUser) initializeChat();
  }, [otherUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !channel) return;
    await channel.sendMessage({ text: newMessage });
    setnewMessage("");
  };

  if (loading || !client || !channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto" />
          <p className="mt-4 text-gray-600">Loading your chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white shadow rounded-lg">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scroll-smooth"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg break-words ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.text}
              <div className="text-xs text-gray-700 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setnewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
