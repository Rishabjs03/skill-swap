"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton"; // <-- import Skeleton
import { getBookingsByUser, updateBookingStatus } from "@/lib/actions/booking";
import { useAuth } from "@/lib/context/auth-context";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  date: string;
  notes?: string;
  skill: {
    title: string;
    category?: string;
    owner: { name: string; image: string };
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // Fetch bookings from DB
  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      const res = await getBookingsByUser();
      const mappedBookings: Booking[] = res.map((b) => ({
        id: b.id,
        status: b.status as "pending" | "accepted" | "completed" | "cancelled",
        date: b.date.toISOString(),
        skill: {
          title: b.skill.title,
          category: b.skill.category || undefined,
          owner: {
            name: b.skill.owner.name || "Unknown",
            image: b.skill.owner.image || "",
          },
        },
      }));
      setBookings(mappedBookings);
      setLoading(false);
    }
    fetchBookings();
  }, []);

  const upcoming = bookings.filter(
    (b) => b.status === "pending" || b.status === "accepted"
  );
  const completed = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  if (!user) {
    return (
      <div className="w-full min-h-[80vh] z-99 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            You’re not logged in
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your bookings
          </p>

          <Button
            variant="default"
            className="w-full py-5 text-lg  text-white bg-black rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
            onClick={() => router.push("/auth/sign-in")}
          >
            <ArrowUpRight className="h-5 w-5" />
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="w-full z-99 min-h-screen">
        <div className="flex items-center justify-center space-x-4 mt-10 px-10">
          <Skeleton className="w-14 h-14 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded bg-gray-200" />
            <Skeleton className="h-3 w-1/2 rounded bg-gray-200" />
            <Skeleton className="h-5 w-1/4 rounded bg-gray-200" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
        </div>
        <div className="mt-4 flex justify-between items-center  px-10">
          <div className="space-y-1">
            <Skeleton className="h-3 w-32 rounded bg-gray-200" />
            <Skeleton className="h-3 w-24 rounded bg-gray-200" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full bg-gray-200" />
        </div>
      </div>
    );

  return (
    <div className="container z-99 mx-auto py-8 px-4 md:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid grid-cols-3 gap-2 mb-6">
          <TabsTrigger
            value="upcoming"
            className="flex justify-between items-center px-3 border-gray-200 shadow-lg"
          >
            Upcoming{" "}
            <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {upcoming.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="flex justify-between items-center px-3 border-gray-200 shadow-lg"
          >
            Completed{" "}
            <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              {completed.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="flex justify-between items-center px-3 border-gray-200 shadow-lg"
          >
            Cancelled{" "}
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cancelled.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcoming.length === 0 ? (
            <p className="text-center text-gray-500">No upcoming bookings</p>
          ) : (
            upcoming.map((b) => <BookingCard key={b.id} booking={b} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completed.length === 0 ? (
            <p className="text-center text-gray-500">No completed bookings</p>
          ) : (
            completed.map((b) => <BookingCard key={b.id} booking={b} />)
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelled.length === 0 ? (
            <p className="text-center text-gray-500">No cancelled bookings</p>
          ) : (
            cancelled.map((b) => <BookingCard key={b.id} booking={b} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Booking Card Component
function BookingCard({ booking }: { booking: Booking }) {
  const statusMap = {
    pending: { label: "Pending", color: "bg-yellow-500", icon: AlertCircle },
    accepted: { label: "Confirmed", color: "bg-blue-500", icon: CheckCircle },
    completed: { label: "Completed", color: "bg-green-500", icon: CheckCircle },
    cancelled: { label: "Cancelled", color: "bg-red-500", icon: XCircle },
  };

  const StatusIcon = statusMap[booking.status].icon;

  const handleCancel = async () => {
    await updateBookingStatus(booking.id, "cancelled");
    alert("Booking cancelled! Refresh to see updates.");
  };

  return (
    <Card className="mb-4 hover:shadow-xl transition-shadow rounded-xl border-2 bg-white z-99 border-gray-200 shadow-lg">
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={booking.skill.owner.image} />
            <AvatarFallback>{booking.skill.owner.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{booking.skill.title}</h3>
            <p className="text-sm text-gray-500">
              with {booking.skill.owner.name}
            </p>
            {booking.skill.category && (
              <Badge className="mt-1 bg-black text-white rounded-xl">
                {booking.skill.category}
              </Badge>
            )}
          </div>
        </div>

        <Badge
          className={`${statusMap[booking.status].color} text-white flex items-center`}
        >
          <StatusIcon className="w-4 h-4 mr-1" />
          {statusMap[booking.status].label}
        </Badge>
      </CardHeader>

      <CardContent className="flex justify-between items-center mt-2">
        <div className="text-sm space-y-1">
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            {new Date(booking.date).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            {new Date(booking.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {booking.notes && (
            <p className="text-gray-500">Notes: {booking.notes}</p>
          )}
        </div>

        {booking.status === "pending" && (
          <Button
            size="sm"
            variant="outline"
            className="ml-4 bg-black text-white hover:scale-105"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
