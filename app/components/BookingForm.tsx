"usec client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateBooking } from "@/lib/actions/booking";

import { useAuth } from "@/lib/context/auth-context";

import { toast } from "sonner";

import { ChevronDownIcon, Clock, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GetUserRole } from "@/lib/actions/profile";

interface skills {
  id: string;
  title: string;
  rate: number;
}

const BookingForm: React.FC<{ skill: skills }> = ({ skill }) => {
  const [open, setopen] = useState(false);
  const [date, setdate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [openTime, setOpenTime] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [role, setrole] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  if (!skill) return null;

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
  }, []);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }
    if (role === "Teacher") {
      toast.error("Only a student can book!");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    if (!timeSlot) {
      toast.error("Please select a time");
      return;
    }
    setisloading(true);
    try {
      const bookingcreated = await CreateBooking(
        skill?.id,
        date?.toISOString(),
        timeSlot
      );
      if (!bookingcreated) {
        toast.error("Failed to book!");
      }
      toast.success("Booked your session!");
      router.push("/bookings");
    } catch (error) {
      console.error(error);
      alert("Booking failed");
    } finally {
      setdate(undefined);
      setTimeSlot("");
      setisloading(false);
    }
  }
  return (
    <Card className="bg-white  shadow-xl border-gray-200 border-2">
      <CardHeader>
        <CardTitle className="flex items-center text-xl space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Book a Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="w-full ">
          <div className="flex w-full  flex-col gap-3">
            <Label htmlFor="date" className="px-1">
              Session Date
            </Label>
            <Popover open={open} onOpenChange={setopen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal bg-white  border-gray-200 border-2 rounded-xl"
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0 bg-white border-gray-200 border-2 shadow-xl"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setdate(date);
                    setopen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex w-full flex-col gap-1 mt-2">
            <Label htmlFor="timeSlot">Session Time</Label>
            <Popover open={openTime} onOpenChange={setOpenTime}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal bg-white border-gray-200 border-2 rounded-xl"
                >
                  {timeSlot ? timeSlot : "Select time slot"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-2 w-full bg-white  border-gray-200"
                align="start"
              >
                <div className="flex flex-col gap-1">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant="ghost"
                      className="justify-start w-full"
                      onClick={() => {
                        setTimeSlot(slot);
                        setOpenTime(false);
                      }}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="rounded-lg bg-gray-100 p-4 mt-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Hourly rate:</span>
              <span className="font-medium">${skill.rate}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Total:</span>
                </span>
                <span className="text-primary">${skill?.rate}</span>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isloading}
            className="w-full mt-5 bg-gradient-to-br from-purple-400 via-pink-300 to-white text-lg  hover:opacity-90"
            size="lg"
          >
            {isloading ? (
              <p>Booking...</p>
            ) : (
              <p>Request Booking - ${skill?.rate}</p>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
