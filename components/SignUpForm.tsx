import { useForm } from "react-hook-form"
import { useSignUp } from "@clerk/nextjs"
import { z } from "zod"
import { signUpSchema } from "@/schemas/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardBody, CardHeader, CardFooter, Divider } from "@heroui/card"
import {Divider} from "@heroui/divider";
import { Button } from "@heroui/button"
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link"

export default function SignUpForm() {


    const router = useRouter()

    const [verifying, setVerifying] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)
    const [verificationCode, setVerificationCode] = useState("")
    const [verificationError, setVerificationError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const { signUp, isLoaded, setActive } = useSignUp()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passowrdConfirmations: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if (!isLoaded) return
        setIsSubmitting(true)
        setAuthError(null)

        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password
            })
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })
            setVerifying(true)

        } catch (error: any) {
            console.log("error in signing up", error);
            setAuthError(
                error.errors?.[0]?.message || " an error occoured during signup. PTA"
            )
        }
        finally {
            setIsSubmitting(false)
        }

    }


    const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isLoaded || !signUp) return
        setIsSubmitting(true)
        setAuthError(null)

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode
            })
            console.log(result);
            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                router.push("/dashboard")
            } else {
                console.error("Verification incomplete", result)
                setVerificationError("Verification could not be completed")
            }
        } catch (error: any) {
            setVerificationError(error.errors?.[0].message || "Verification could not be completed, Please try again")

        }
        finally {
            setIsSubmitting(false)
        }

    }

    return (
        <Card className="w-full max-w-md border border-default-200 bg-default-50 shadow-xl">
            <CardHeader className="flex flex-col gap-1 items-center pb-2">
                <h1 className="text-2xl font-bold text-default-900">Welcome to Dropper</h1>
                <p className="text-default-500 text-center">
                    sign-in and store your data on cloud in a jiff!!
                </p>
            </CardHeader>
            <Divider />

            <CardBody className="py-6">
                {authError && (
                    <div className="bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p>{authError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="identifier"
                            className="text-sm font-medium text-default-900"
                        > Email
                        </label>
                        <input
                            id="identifier"
                            type="email"
                            placeholder="your.email@example.com"
                            startContent={<Mail className="h-4 w-4 text-default-500" />}
                            isInvalid={!!errors.identifier}
                            errorMessage={errors.identifier?.message}
                            {...register("email")}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-default-900"
                            >Password
                            </label>
                        </div>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="**********"
                            startContent={<Lock className="h-4 w-4 text-default-500" />}
                            endContent={
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    onClick={() => setShowPassword(!showPassword)}
                                    type="button"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-default-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-default-500" />
                                    )}
                                </Button>
                            }
                            isInvalid={!!errors.password}
                            errorMessage={errors.password?.message}
                            {...register("password")}
                            className="w-full"
                        />
                    </div>

                    <Button
                        type="submit"
                        color="primary"
                        className="w-full"
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </CardBody>

            <Divider />
            <CardFooter className="flex justify-center py-4">
                <p className="text-sm text-default-600">
                    You do not have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="text-primary hover:underline font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>

    )
}
