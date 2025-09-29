"use server"

import { headers } from "next/headers"
import { auth } from "../auth"
import { revalidatePath } from "next/cache"

import { PrismaClient } from "../generated/prisma"
import { uploadToCloudinary } from "../cloudinary/cloudinary"

const prisma = new PrismaClient()

export async function GetMyProfile() {

    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        throw new Error("User not authenticated")
    }

    try {
        const result = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                createdAt: true,
                skills: true,
            },

        })
        return result
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error("Failed to fetch user profile");
    }
}

export async function getUserProfile(userId: string) {

    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            image: true,
            name: true,
            bio: true,
            skills: true,
        }
    })
}

export async function UpdateProfileAction(formData: FormData) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        throw new Error("User not authenticated")
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string
    const bio = formData.get("bio") as string;
    const skills = JSON.parse(formData.get("skills") as string) as string[];
    const avatarFile = formData.get("avatar") as File | null;

    let imageUrl: string | null = null;
    // 1️⃣ Handle avatar upload (optional)
    if (avatarFile) {
        const uploadResult = (await uploadToCloudinary(avatarFile))
        imageUrl = uploadResult.secure_url;
    }


    // 2️⃣ Update user
    const updatedUser = await prisma.user.update({
        where: { id: session?.user.id },
        data: {
            name: name,
            email: email,
            bio: bio,
            image: imageUrl || undefined, // agar null hai to ignore
        },
    });

    // 3️⃣ Update skills
    // Example: delete old skills + add new ones
    await Promise.all(
        skills.map(title =>
            prisma.skill.create({
                data: { title, ownerId: session?.user.id, description: "", rate: 0 },
            })
        )
    );

    // 4️⃣ Optional: Revalidate profile page
    revalidatePath(`/profile/${session?.user.id}`);

    return updatedUser;
}



