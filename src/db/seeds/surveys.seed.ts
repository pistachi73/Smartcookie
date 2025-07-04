import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import { eq } from "drizzle-orm";
import questionsSeedData from "./data/questions.seed-data";

export default async function seed(db: DB) {
  console.log("Seeding surveys...");
  const user = await db.query.user.findFirst({
    where: eq(schema.user.email, "oscarpulido98@gmail.com"),
  });
  if (!user) throw new Error("User not found!");

  // Create questions
  const questions = await db
    .insert(schema.questions)
    .values(
      questionsSeedData.map((question) => ({
        userId: user.id,
        ...question,
      })),
    )
    .returning();

  if (!questions.length) throw new Error("Questions not found!");

  const [sT] = await db
    .insert(schema.surveyTemplates)
    .values({
      userId: user.id,
      title: "Survey Template",
      description: "Survey Template Description",
    })
    .returning();

  if (!sT) throw new Error("Survey template not found!");

  // Create survey template questions with fractional ordering
  const surTempQuest = questions.map((question, index) => ({
    surveyTemplateId: sT.id,
    questionId: question.id,
    required: true,
    order: index + 1,
  }));

  await db.insert(schema.surveyTemplateQuestions).values(surTempQuest);
}
