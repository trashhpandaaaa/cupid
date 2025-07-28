const { z } = require("zod");

// Registration schema
const registrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.number().int().positive().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  city: z.string().optional(),
});

// Login schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

module.exports = { registrationSchema, loginSchema };

