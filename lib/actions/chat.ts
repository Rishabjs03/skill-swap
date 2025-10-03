"use server"

import { PrismaClient } from "../generated/prisma"



const prisma = new PrismaClient()

export async function getOtherUser(bookingId: string, currentUserId: string) {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            user: true,
            skill: {
                include: { owner: true },
            }
        }
    })

    if (!booking) throw new Error("Booking not found");

    const student = booking.user;
    const instructor = booking.skill.owner;

    const otherUser = currentUserId === student.id ? instructor : student;

    return {
        id: otherUser.id,
        name: otherUser.name,
        image: otherUser.image,
    };
}