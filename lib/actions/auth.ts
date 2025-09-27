"use server"

import { headers } from "next/headers"
import { auth } from "../auth"



export async function SignUpUser(email: string, password: string, name: string) {
    const result = await auth.api.signUpEmail({
        body: {
            email, password, name, callbackURL: "/"
        }
    })
    return result
}

export async function SignInUser(email: string, password: string) {
    const result = await auth.api.signInEmail({
        body: {
            email, password, callbackURL: "/"
        }
    })
    return result
}
export async function SignOut() {
    const result = await auth.api.signOut({ headers: await headers() })
    return result
}