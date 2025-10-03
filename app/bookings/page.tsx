"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingCard from "../components/BookingCard";
import { getBookingsByUser } from "@/lib/actions/booking";
import { useAuth } from "@/lib/context/auth-context";
import { GetUserRole } from "@/lib/actions/profile";

export default function BookingsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setrole] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    GetUserRole()
      .then((res) => {
        if (res && res.role) {
          setrole(res.role);
        } else {
          setrole("");
        }
      })
      .catch((err) => console.error(err));
    async function fetchBookings() {
      setLoading(true);
      try {
        const data = await getBookingsByUser();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "accepted"
  );
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  if (!user) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          Please log in to view your bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] w-full px-4 md:px-8 lg:px-16">
      <div className="w-full py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-semibold mb-2">
              My Bookings
            </h1>
            <p className="text-base md:text-lg font-light text-gray-600">
              Manage your bookings
            </p>
          </div>
        </div>

        <Tabs
          defaultValue="upcoming"
          className="w-full py-2 px-2 border-2 border-gray-200 rounded-xl bg-white shadow-xl"
        >
          <TabsList className="flex w-full bg-gray-200 rounded-lg overflow-hidden">
            <TabsTrigger
              value="upcoming"
              className="flex-1 text-center data-[state=active]:bg-white"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex-1 text-center data-[state=active]:bg-white"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="flex-1 text-center data-[state=active]:bg-white"
            >
              Cancelled
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="w-full h-[500px] border-0 rounded-lg relative whitespace-nowrap mt-4">
            <TabsContent
              value="upcoming"
              className="space-y-6 p-6 text-gray-800"
            >
              {loading ? (
                <p>Loading...</p>
              ) : upcomingBookings.length === 0 ? (
                <p className="text-gray-500">No upcoming bookings</p>
              ) : (
                upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    userRole={role || "Student"}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent
              value="completed"
              className="space-y-6 p-6 text-gray-800"
            >
              {loading ? (
                <p>Loading...</p>
              ) : completedBookings.length === 0 ? (
                <p className="text-gray-500">No completed bookings</p>
              ) : (
                completedBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    userRole={role || "Student"}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent
              value="cancelled"
              className="space-y-6 p-6 text-gray-800"
            >
              {loading ? (
                <p>Loading...</p>
              ) : cancelledBookings.length === 0 ? (
                <p className="text-gray-500">No cancelled bookings</p>
              ) : (
                cancelledBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    userRole={role || "Student"}
                  />
                ))
              )}
            </TabsContent>

            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
