import { z } from "zod";

export const GetStudentsByHubIdSchema = z.object({
  hubId: z.number(),
});

export const AddStudentSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

export const AddStudentToHubSchema = z.object({
  studentId: z.number(),
  hubId: z.number(),
});

export const RemoveStudentFromHubSchema = AddStudentToHubSchema;

export const CreateStudentInHubSchema = z.object({
  student: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string(),
  }),
  hubId: z.number(),
});
