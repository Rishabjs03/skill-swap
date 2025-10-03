"use server"

import { headers } from "next/headers"
import { auth } from "../auth"
import { PrismaClient } from "../generated/prisma"


const prisma = new PrismaClient()
export async function SignUpUser(email: string, password: string, name: string, role: string) {
    const result = await auth.api.signUpEmail({
        body: {
            email, password, name, callbackURL: "/"
        }
    })
    if (result.user) {
        await prisma.user.update({
            where: { id: result.user.id },
            data: { role },
        })
    }

    return result
}

export async function SignInUser(email: string, password: string) {
    try {
        const result = await auth.api.signInEmail({
            body: {
                email,
                password,
                callbackURL: "/",
            },
        });


        return { user: result?.user ?? null, raw: result };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {

        const message =
            err?.message ||
            err?.response?.data?.message ||
            "Invalid email or password";

        return { error: message };
    }
}
export async function SignOut() {
    const result = await auth.api.signOut({ headers: await headers() })
    return result
}