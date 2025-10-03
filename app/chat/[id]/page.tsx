"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getOtherUser } from "@/lib/actions/chat";
import { GetSessionUser } from "@/lib/actions/session";
import { useAuth } from "@/lib/context/auth-context";
import { ArrowLeft } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface OtherUserProps {
  id: string;
  name: string | null;
  image: string | null;
}

export default function ChatPage() {
  const router = useRouter();
  const pathName = usePathname();
  const bookingId = pathName.split("/").pop() || "";

  const [otherUser, setotherUser] = useState<OtherUserProps | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const user = await GetSessionUser();
      console.log("user:", user);
      setCurrentUser(user);
      if (!user || !bookingId) return;
      const u = await getOtherUser(bookingId, user.id);
      console.log("u:", u);
      setotherUser(u);
    }
    fetchUser();
  }, [bookingId]);

  return (
    <div className="min-h-[70vh] w-full px-4 md:px-8 lg:px-16 flex items-center justify-center">
      <div className="w-full md:w-1/3 max-w-2xl py-4 flex flex-col border rounded-2xl shadow-lg bg-white">
        <div className="flex items-center justify-start gap-3 border-b pb-4">
          <div className="ml-2">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="hover:bg-gray-200 text-black rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <Avatar>
            <AvatarImage src={otherUser?.image || "/default.jpg"} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-light">{otherUser?.name}</h2>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center text-gray-500">
          Messages will appear here
        </div>
      </div>
    </div>
  );
}
