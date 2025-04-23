import { isValidPhoneNumber } from "libphonenumber-js/min";
import { z } from "zod";

export const GetStudentsByHubIdSchema = z.object({
  hubId: z.number(),
});

export const CreateStudentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().refine(
    (phone) => {
      if (!phone) return true; // Allow empty phone
      try {
        return isValidPhoneNumber(phone);
      } catch (e) {
        return false;
      }
    },
    { message: "Please enter a valid phone number" },
  ),
});

export const AddStudentFormSchema = z.object({
  studentId: z.number().min(1, "Please select a student"),
});

export const CreateStudentInHubUseCaseSchema = z.object({
  formData: CreateStudentFormSchema,
  hubId: z.number(),
});

export const AddAttendanceSchema = z.object({
  sessionIds: z.array(z.number()),
  studentIds: z.array(z.number()),
});

export const AddStudentToHuUseCaseSchema = z.object({
  studentId: z.number(),
  hubId: z.number(),
});

export const RemoveStudentFromHubUseCaseSchema = z.object({
  studentId: z.number(),
  hubId: z.number(),
});
