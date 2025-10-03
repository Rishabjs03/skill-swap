"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient();

export async function CreateBooking(skillId: string, date: string, timeSlot: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("User not authenticated");
  }
  const bookingDate = new Date(date);
  try {
    const booking = await prisma.booking.create({
      data: {
        skillId,
        userId: session?.user.id,
        date: bookingDate,
        timeSlot
      },
    });
    return booking;
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw new Error("Failed to book session");
  }
}

export async function getBookingsByUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    throw new Error("user not logged in")
  }
  return prisma.booking.findMany({
    where: { userId: session?.user.id },
    include: {
      skill: {
        include: { owner: true },
      },
    },
    orderBy: { date: "desc" },
  });
}
export async function updateBookingStatus(bookingId: string, status: string) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
}