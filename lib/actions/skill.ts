"use server"

import { headers } from "next/headers"
import { auth } from "../auth"
import { PrismaClient } from "../generated/prisma"


const prisma = new PrismaClient()

export async function CreateSkill(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        throw new Error("User not authenticated")
    }

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const category = formData.get("category")?.toString();
    const rate = parseFloat(formData.get("rate")?.toString() || "0");

    if (!title || !category || !description) {
        throw new Error("All fields are required");
    }

    try {
        const result = await prisma.skill.create({
            data: {
                ownerId: session.user.id,
                title: title,
                description: description,
                category: category,
                rate: rate,
            },
        });
        return result
    } catch (error) {
        console.error("error in create skill:", error)
        throw new Error("Failed to create Skill")
    }
}