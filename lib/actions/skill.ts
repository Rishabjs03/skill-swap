"use server"

import { headers } from "next/headers"
import { auth } from "../auth"
import { PrismaClient } from "@prisma/client"


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

export async function getAllSkills(filters: { search?: string, category?: string, rate?: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (filters.search) {
        where.title = {
            contains: filters.search,
            mode: "insensitive",
        };
    }
    if (filters.category) {
        where.category = filters.category;
    }
    if (filters.rate) {
        const [min, max] = filters.rate.split("-").map(Number);
        where.rate = {
            gte: min,
            lte: max || 99999,
        };
    }
    return await prisma.skill.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            owner: true
        }
    });
}

export async function getSkill(id: string) {
    const skill = await prisma.skill.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    bio: true
                },
            },
        },
    });
    return skill;
}