import { z } from "zod";

const address_schema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),

  country: z.string().default("India"),
  addressLine1: z.string().min(5, {
    message: "Address line 1 is required and must be at least 5 characters.",
  }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "Town/City is required." }),
  state: z.string({ required_error: "Please select a state." }),
  postcode: z.string().min(6, { message: "Valid postcode/ZIP is required." }),
  phone: z.string().min(10, { message: "Valid phone number is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});
const address_schema_cart = z.object({
  country: z.string().default("India"),
  state: z.string({ required_error: "Please select a state." }),
});
const account_schema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().optional(),
    displayName: z
      .string()
      .min(2, { message: "Display name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    newPassword: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (val === undefined) return true;
          if (val.length !== undefined && val.length <= 8) return true;
          return val.length >= 8;
        },
        { message: "Password must be at least 8 characters." }
      ),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only check passwords match if changePassword is true
      if (data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );
export { address_schema, account_schema, address_schema_cart };
