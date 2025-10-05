"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

type BookingStatus = "pending" | "accepted" | "completed" | "cancelled";

export async function CreateBooking(skillId: string, date: string, timeSlot: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("User not authenticated");

  const bookingDate = new Date(date);

  try {
    const booking = await prisma.booking.create({
      data: {
        skillId,
        userId: session.user.id,
        date: bookingDate,
        timeSlot,
      },
    });
    return booking;
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw new Error("Failed to book session");
  }
}

export async function getBookingsByUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("User not logged in");

  const userRecord = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!userRecord) throw new Error("User not found");

  if (userRecord.role === "Teacher") {
    return prisma.booking.findMany({
      where: { skill: { ownerId: session.user.id } },
      include: {
        skill: { include: { owner: true } },
        user: true,

      },
      orderBy: { date: "desc" },
    }).then(bookings =>
      bookings.map(b => ({
        ...b,
        student: b.user,
      }))
    );
  } else {
    return prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        skill: { include: { owner: true } },
        user: true, // 👈 student ki id lene ke liye
      },
      orderBy: { date: "desc" },
    }).then(bookings =>
      bookings.map(b => ({
        ...b,
        student: b.user, // ✅ student object add kar diya
      }))
    );
  }
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
}
