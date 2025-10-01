"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function CreateBooking(skillId: string, date: string) {
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
      },
    });
    return booking;
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw new Error("Failed to book session");
  }
}
