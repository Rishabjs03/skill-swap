"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { updateBookingStatus } from "@/lib/actions/booking";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BookingCardProps {
  booking: {
    id: string;
    status: "pending" | "accepted" | "completed" | "cancelled";
    date: string;
    timeSlot: string | null;
    skill: {
      title: string;
      category?: string;
      owner: {
        name: string;
        image: string | null;
      };
    };
    student?: {
      name: string | null;
      image: string | null;
    };
  };
  userRole: string;
}

export default function BookingCard({ booking, userRole }: BookingCardProps) {
  const [status, setStatus] = useState(booking.status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const statusMap = {
    pending: { label: "Pending", color: "bg-yellow-500", icon: AlertCircle },
    accepted: { label: "Confirmed", color: "bg-blue-500", icon: CheckCircle },
    completed: { label: "Completed", color: "bg-green-500", icon: CheckCircle },
    cancelled: { label: "Cancelled", color: "bg-red-500", icon: XCircle },
  };

  const StatusIcon = statusMap[status].icon;

  const displayUser =
    userRole === "Teacher"
      ? {
          name: booking.student?.name || "Unknown",
          image: booking.student?.image || null,
        }
      : { name: booking.skill.owner.name, image: booking.skill.owner.image };

  const handleAccept = async () => {
    if (status !== "pending") return;

    setStatus("accepted");
    setLoading(true);
    try {
      await updateBookingStatus(booking.id, "accepted");
      toast.success("Booking accepted!");
    } catch (err) {
      console.error(err);
      setStatus("pending");
      toast.error("Failed to accept booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (status === "cancelled") return;
    setStatus("cancelled");
    setLoading(true);
    try {
      await updateBookingStatus(booking.id, "cancelled");
      toast.success("Booking cancelled!");
    } catch (err) {
      console.error(err);
      setStatus(booking.status);
      toast.error("Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 bg-white border-gray-200 border-2">
      <CardHeader className="flex justify-between items-start pb-1">
        <div className="flex gap-3 items-center">
          {displayUser && (
            <Avatar className="w-12 h-12">
              {displayUser.image ? (
                <AvatarImage src={displayUser.image} />
              ) : (
                <AvatarFallback>{displayUser.name[0]}</AvatarFallback>
              )}
            </Avatar>
          )}

          <div className="flex flex-col">
            {booking.skill.category && (
              <Badge className="mb-1 rounded-full text-sm bg-black text-white">
                {booking.skill.category}
              </Badge>
            )}
            <h3 className="font-semibold text-xl leading-tight group-hover:text-primary transition-colors">
              {booking.skill.title}
            </h3>
            <p className="text-sm font-medium text-gray-500">
              {userRole === "Teacher"
                ? `with ${displayUser.name}`
                : `by ${displayUser.name}`}
            </p>
          </div>
        </div>

        <Badge
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-white ${statusMap[status].color}`}
        >
          <StatusIcon className="w-4 h-4" />
          {statusMap[status].label}
        </Badge>
      </CardHeader>

      <CardContent className="flex justify-between items-center mt-2">
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <p className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(booking.date).toLocaleDateString()}
          </p>
          {booking.timeSlot && (
            <p className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {booking.timeSlot}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 mt-2">
        {userRole === "Teacher" && status === "pending" && (
          <Button
            size="sm"
            variant="default"
            onClick={handleAccept}
            disabled={loading}
            className="border rounded-lg mr-2"
          >
            Accept
          </Button>
        )}

        {status === "accepted" && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => router.push(`/chat/${booking.id}`)}
            disabled={loading}
            className="flex items-center gap-1 border rounded-lg mr-2"
          >
            <MessageSquare className="w-4 h-4" /> Chat
          </Button>
        )}

        {status !== "cancelled" && (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}
            className="text-white bg-red-500"
          >
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
