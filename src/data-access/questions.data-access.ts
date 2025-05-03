import { db } from "@/db";
import { questions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getQuestionById = async (id: number) => {
  const question = await db.query.questions.findFirst({
    where: eq(questions.id, id),
  });
  return question;
};
