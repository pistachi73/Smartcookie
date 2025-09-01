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

export const GetPaginatedUserStudentsSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).default(10),
  q: z.string().optional(),
});

export const GetStudentByIdSchema = z.object({
  id: z.number(),
});

export const DeleteStudentSchema = z.object({
  studentId: z.number(),
});

export const UpdateStudentSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name must be at least 1 character").optional(),
  email: z.string().email("Please enter a valid email").optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  nationality: z.string().optional(),
  job: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  birthDate: z.string().optional(),
  motherLanguage: z.string().optional(),
  learningLanguage: z.string().optional(),
  image: z.string().optional(),
  interests: z.string().optional(),
  age: z.number().int().positive().optional(),
});
