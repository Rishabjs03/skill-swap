"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient()

export async function createReview(bookingId: string, studentId: string, rating: number, comment: string) {
    try {
        const review = await prisma.review.create({
            data: {
                bookingId,
                studentId,
                rating,
                comment,
            },
        });

        revalidatePath("/bookings"); // refresh page data
        return review;
    } catch (err) {
        console.error("Failed to create review:", err);
        throw new Error("Could not create review");
    }
}

