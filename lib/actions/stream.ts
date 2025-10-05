"use server"

import { headers } from "next/headers"
import { auth } from "../auth"
import { PrismaClient } from "../generated/prisma"
import { StreamChat } from "stream-chat"

const prisma = new PrismaClient()

export async function getStreamUserToken() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        throw new Error("User not authenticated!")
    }

    const user = session.user


    const loggedUserData = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            name: true,
            image: true,
        }
    })

    if (!loggedUserData) {
        console.error("Error fetching user data")
        throw new Error("Failed to fetch user data")
    }


    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
    const apiSecret = process.env.STREAM_API_SECRET

    if (!apiKey || !apiSecret) {
        throw new Error("Stream API key or secret is missing!")
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret)


    await serverClient.upsertUser({
        id: user.id,
        name: loggedUserData.name || "Anonymous",
        image: loggedUserData.image || undefined,
    })

    const token = serverClient.createToken(user.id)
    return {
        token,
        userId: user.id,
        userName: loggedUserData.name || "Anonymous",
        userImage: loggedUserData.image || undefined,
    }
}


export async function createOrGetChannel(otherUserId: string) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        throw new Error("User not authenticated!")
    }

    const userId = session.user.id

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
    const apiSecret = process.env.STREAM_API_SECRET

    if (!apiKey || !apiSecret) {
        throw new Error("Stream API key or secret is missing!")
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret)

    const sortedIds = [userId, otherUserId].sort()
    const combineIds = sortedIds.join("-")

    let hash = 0;
    for (let i = 0; i < combineIds.length; i++) {
        const char = combineIds.charCodeAt(i)
        hash = (hash << 5) - hash + char;
        hash = hash & hash;

    }

    const channelId = `match_${Math.abs(hash).toString(36)}`

    const otherUserData = await prisma.user.findUnique({
        where: {
            id: otherUserId
        },
        select: {
            name: true,
            image: true,
        }
    })
    if (!otherUserData) {
        console.error("Error fetching other user data:")
        throw new Error("failed to fetch other user data ")
    }

    const channel = serverClient.channel("messaging", channelId, {
        members: [userId, otherUserId],
        created_by_id: userId,
    })
    await serverClient.upsertUser({
        id: otherUserId,
        name: otherUserData.name || "Anonymous",
        image: otherUserData.image || undefined,
    })

    try {
        await channel.create()
        console.log("channel created successfully", channelId)
    } catch (error) {
        console.error("error in channel creation", error)

        if (error instanceof Error && !error.message.includes("already exists")) {
            throw error
        }
    }


    return { channelId, channelType: "messaging" }
}