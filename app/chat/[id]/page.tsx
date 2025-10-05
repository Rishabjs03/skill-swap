"use client";
import StreamChatInterface from "@/app/components/StreamChatInterface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { updateBookingStatus } from "@/lib/actions/booking";
import { getOtherUser } from "@/lib/actions/chat";
import { GetUserRole } from "@/lib/actions/profile";
import { GetSessionUser } from "@/lib/actions/session";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [role, setrole] = useState("");

  useEffect(() => {
    GetUserRole()
      .then((res) => setrole(res?.role || ""))
      .catch((err) => console.error(err));

    async function fetchUser() {
      const user = await GetSessionUser();
      setCurrentUser(user);
      if (!user || !bookingId) return;
      const u = await getOtherUser(bookingId, user.id);
      setotherUser(u);
    }
    fetchUser();
  }, [bookingId]);

  async function handleStatus() {
    await updateBookingStatus(bookingId, "completed");
    toast.success("Session Completed!");
    router.push("/bookings");
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center  px-2 sm:px-4 md:px-8 lg:px-16">
      <div className="w-full max-w-lg flex flex-col border rounded-2xl shadow-lg bg-white overflow-hidden ">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3 bg-white">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="hover:bg-gray-200 text-black rounded-full p-2 sm:p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
              <AvatarImage src={otherUser?.image || "/default.jpg"} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                {otherUser?.name || "User"}
              </h2>
            </div>
          </div>

          {role === "Teacher" && (
            <Button
              variant="outline"
              onClick={handleStatus}
              className="border-green-600 text-green-600 hover:bg-green-50 text-sm sm:text-base"
            >
              Complete
            </Button>
          )}
        </div>

        <div className="flex-1 min-h-0">
          {otherUser ? (
            <StreamChatInterface otherUser={otherUser} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Loading chat...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
