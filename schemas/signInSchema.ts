import * as z from "zod"

export const signInSchema = z.object({
    identifier: z
        .string()
        .min(1, { message: "Email is requried" })
        .email({ message: "please enter a valid email" }),
    password: z
        .string()
        .min(1, { message: "please enter a password" })

})
