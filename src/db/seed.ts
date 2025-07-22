import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import type { Table } from "drizzle-orm";
import { eq, getTableName, ne, notInArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema/index";
import * as seeds from "@/db/seeds";
import { env } from "@/env";

const connection = neon(env.DATABASE_URL);
const db = drizzle(connection, { schema, casing: "snake_case" });
export type DB = typeof db;

async function resetTable(db: DB, table: Table) {
  console.log(`Resetting ${getTableName(table)} table!`);

  return db.execute(
    sql.raw(
      `TRUNCATE TABLE "${getTableName(table)}" RESTART IDENTITY CASCADE;`,
    ),
  );
}

async function main() {
  try {
    console.log("Starting selective cleanup...");

    // Get Martina's user ID
    const martinaUser = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.email, "infomartinamotiva@gmail.com"))
      .limit(1);

    if (martinaUser.length === 0) {
      console.error("Martina's user not found!");
      process.exit(1);
    }

    const martinaUserId = martinaUser[0]!.id;
    console.log(`Found Martina's user ID: ${martinaUserId}`);

    // Delete users except Martina
    const deletedUsers = await db
      .delete(schema.user)
      .where(ne(schema.user.email, "infomartinamotiva@gmail.com"))
      .returning();

    console.log(`Deleted ${deletedUsers.map((u) => u.email).join(", ")} users`);

    // Delete records from tables with direct userId relationships
    console.log("Deleting records with direct userId relationships...");

    await db.delete(schema.hub).where(ne(schema.hub.userId, martinaUserId));
    await db
      .delete(schema.student)
      .where(ne(schema.student.userId, martinaUserId));

    await db
      .delete(schema.quickNote)
      .where(ne(schema.quickNote.userId, martinaUserId));
    await db
      .delete(schema.session)
      .where(ne(schema.session.userId, martinaUserId));
    await db
      .delete(schema.sessionNote)
      .where(ne(schema.sessionNote.userId, martinaUserId));
    await db
      .delete(schema.surveys)
      .where(ne(schema.surveys.userId, martinaUserId));
    await db
      .delete(schema.questions)
      .where(ne(schema.questions.userId, martinaUserId));
    await db
      .delete(schema.surveyTemplates)
      .where(ne(schema.surveyTemplates.userId, martinaUserId));
    await db
      .delete(schema.account)
      .where(ne(schema.account.userId, martinaUserId));
    await db
      .delete(schema.twoFactorConirmation)
      .where(ne(schema.twoFactorConirmation.userId, martinaUserId));

    // Get Martina's hub IDs for indirect relationships
    const martinaHubs = await db
      .select({ id: schema.hub.id })
      .from(schema.hub)
      .where(eq(schema.hub.userId, martinaUserId));

    const martinaHubIds = martinaHubs.map((h) => h.id);

    // Get Martina's question IDs for answers cleanup
    const martinaQuestions = await db
      .select({ id: schema.questions.id })
      .from(schema.questions)
      .where(eq(schema.questions.userId, martinaUserId));

    const martinaQuestionIds = martinaQuestions.map((q) => q.id);

    // Get Martina's survey IDs for survey responses cleanup
    const martinaSurveys = await db
      .select({ id: schema.surveys.id })
      .from(schema.surveys)
      .where(eq(schema.surveys.userId, martinaUserId));

    const martinaSurveyIds = martinaSurveys.map((s) => s.id);

    // Get Martina's survey template IDs
    const martinaSurveyTemplates = await db
      .select({ id: schema.surveyTemplates.id })
      .from(schema.surveyTemplates)
      .where(eq(schema.surveyTemplates.userId, martinaUserId));

    const martinaSurveyTemplateIds = martinaSurveyTemplates.map((st) => st.id);

    // Delete records from tables with indirect relationships
    console.log("Deleting records with indirect relationships...");

    // Clean up attendance (through hubId)
    if (martinaHubIds.length > 0) {
      await db
        .delete(schema.attendance)
        .where(notInArray(schema.attendance.hubId, martinaHubIds));
    } else {
      await db.delete(schema.attendance);
    }

    // Clean up answers (through questionId)
    if (martinaQuestionIds.length > 0) {
      await db
        .delete(schema.answers)
        .where(notInArray(schema.answers.questionId, martinaQuestionIds));
    } else {
      await db.delete(schema.answers);
    }

    // Clean up survey responses (through surveyId)
    if (martinaSurveyIds.length > 0) {
      await db
        .delete(schema.surveyResponses)
        .where(notInArray(schema.surveyResponses.surveyId, martinaSurveyIds));
    } else {
      await db.delete(schema.surveyResponses);
    }

    // Clean up survey template questions (through surveyTemplateId)
    if (martinaSurveyTemplateIds.length > 0) {
      await db
        .delete(schema.surveyTemplateQuestions)
        .where(
          notInArray(
            schema.surveyTemplateQuestions.surveyTemplateId,
            martinaSurveyTemplateIds,
          ),
        );
    } else {
      await db.delete(schema.surveyTemplateQuestions);
    }

    // Clean up event-related tables (delete all since events are removed)
    await db.delete(schema.eventParticipant);
    await db.delete(schema.eventOccurrence);

    // Clean up student-hub relationships (through hubId)
    if (martinaHubIds.length > 0) {
      await db
        .delete(schema.studentHub)
        .where(notInArray(schema.studentHub.hubId, martinaHubIds));
    } else {
      await db.delete(schema.studentHub);
    }

    // Clean up billing (through hubId)
    if (martinaHubIds.length > 0) {
      await db
        .delete(schema.billing)
        .where(notInArray(schema.billing.hubId, martinaHubIds));
    } else {
      await db.delete(schema.billing);
    }

    // Reset tables that don't have user relationships (auth-related tokens)
    await resetTable(db, schema.twoFactorToken);
    await resetTable(db, schema.verificationToken);
    await resetTable(db, schema.passwordResetToken);

    console.log("Selective cleanup completed. Starting seeding...");

    await seeds.user(db);
    await seeds.hub(db);
    await seeds.quickNotes(db);
    await seeds.student(db);
    await seeds.session(db);
    await seeds.surveys(db);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

main();
