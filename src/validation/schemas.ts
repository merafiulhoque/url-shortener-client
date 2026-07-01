import z from "zod"


// 1. Define the Zod Schema
export const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export type SignupFormData = z.infer<typeof signupSchema>;