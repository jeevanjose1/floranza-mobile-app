import { z } from "zod";

 const login_schema = z.object({
  email: z.string().min(1,{ message: "Username or email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
})

const change_password = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirm_password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // This makes the error appear under confirm_password
  });

 const reset_password = z.object({
  email: z.string().min(1,{ message: "Email is required" }),
})

const signup_schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { 
      message: "Username can only contain letters, numbers, and underscores" 
    }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    
})

export {
    login_schema,
    signup_schema,
    reset_password,
    change_password
}