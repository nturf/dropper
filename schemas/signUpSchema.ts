import * as z from "zod"

export const signUpSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "password should be atleast 8 characters" }),
    passwordConfirmations: z
        .string()
        .min(1, { message: "please cofirm your password" })

})

    .refine((data) => data.password != data.passwordConfirmations, {
        message: "password do no match",
        path: ["passowrdConfirmations"]

    })
