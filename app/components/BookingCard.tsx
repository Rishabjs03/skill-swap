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
import { createReview } from "@/lib/actions/review";
import ReviewModal from "./ReviewModal";

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
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  userRole: string;
}

export default function BookingCard({ booking, userRole }: BookingCardProps) {
  const [status, setStatus] = useState(booking.status);
  const [loading, setLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [session, setsession] = useState(null);
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
    <>
      <Card className="group overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 bg-white border-gray-200 border-2">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2">
          <div className="flex gap-3 items-center w-full">
            {displayUser && (
              <Avatar className="w-12 h-12">
                {displayUser.image ? (
                  <AvatarImage src={displayUser.image} />
                ) : (
                  <AvatarFallback>{displayUser.name[0]}</AvatarFallback>
                )}
              </Avatar>
            )}

            <div className="flex flex-col w-full">
              {booking.skill.category && (
                <Badge className="mb-1 rounded-full text-xs sm:text-sm bg-black text-white w-fit">
                  {booking.skill.category}
                </Badge>
              )}
              <h3 className="font-semibold text-lg sm:text-xl leading-tight group-hover:text-primary transition-colors">
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
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs sm:text-sm ${statusMap[status].color}`}
          >
            <StatusIcon className="w-4 h-4" />
            {statusMap[status].label}
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
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

        <CardFooter className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
          {userRole === "Teacher" && status === "pending" && (
            <Button
              size="sm"
              variant="default"
              onClick={handleAccept}
              disabled={loading}
              className="border rounded-lg w-full sm:w-auto"
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
              className="flex items-center gap-1 border rounded-lg w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4" /> Chat
            </Button>
          )}
          {status === "completed" && userRole === "Student" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowReview(true)} // ek local state se modal open
              className="flex items-center gap-1 border rounded-lg w-full sm:w-auto"
            >
              Review
            </Button>
          )}

          {status !== "cancelled" && status !== "completed" && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleCancel}
              disabled={loading}
              className="text-white bg-red-500 w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
        </CardFooter>
      </Card>
      <ReviewModal
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        bookingId={booking.id}
        studentId={booking.student!.id}
      />
    </>
  );
}
