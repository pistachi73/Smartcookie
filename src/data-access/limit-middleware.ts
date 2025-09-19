import { and, count, eq } from "drizzle-orm";

import { getPlanLimits, isAtLimit } from "@/core/config/plan-limits";
import { db } from "@/db";
import { hub, quickNote, session, student } from "@/db/schema";
import type { AuthUser } from "@/types/next-auth";
import { createDataAccessError } from "./errors";

export const studentLimitMiddleware = async (context: { user: AuthUser }) => {
  if (context.user.subscriptionTier === "premium") return;

  const [studentsCountRes] = await db
    .select({ count: count() })
    .from(student)
    .where(eq(student.userId, context.user.id));

  const limits = getPlanLimits(context.user.subscriptionTier);
  const current = studentsCountRes?.count || 0;
  const max = limits.students.maxCount;

  if (current >= max && Number.isFinite(max)) {
    return createDataAccessError({
      type: "LIMIT_EXCEEDED_STUDENTS",
      message: `Student limit exceeded. You can have up to ${max} students on your current plan.`,
      meta: { current, max, limitType: "students" },
    });
  }
};

export const sessionLimitMiddleware = async (context: {
  user: AuthUser;
  data: { hubId: number; sessions: any[] };
}) => {
  if (context.user.subscriptionTier === "premium") return;

  const limits = getPlanLimits(context.user.subscriptionTier);
  const sessionsCount = await db
    .select({ count: count() })
    .from(session)
    .where(
      and(
        eq(session.userId, context.user.id),
        eq(session.hubId, context.data.hubId),
      ),
    );

  const currentCount = sessionsCount[0]?.count || 0;
  const overTheLimit =
    currentCount + context.data.sessions.length > limits.sessions.maxPerHub;

  const current = currentCount + context.data.sessions.length;
  const max = limits.sessions.maxPerHub;

  if (overTheLimit) {
    return createDataAccessError({
      type: "LIMIT_REACHED_SESSIONS",
      message: `Session limit exceeded. You can have up to ${max} sessions per hub on your current plan.`,
      meta: { current, max, limitType: "sessions" },
    });
  }
};

export const quickNoteLimitMiddleware = async (context: { user: AuthUser }) => {
  if (context.user.subscriptionTier === "premium") return;

  const limits = getPlanLimits(context.user.subscriptionTier);
  const notesCount = await db
    .select({ count: count() })
    .from(quickNote)
    .where(eq(quickNote.userId, context.user.id));

  const currentCount = notesCount[0]?.count || 0;

  if (isAtLimit(currentCount, limits.notes.maxCount)) {
    return createDataAccessError({
      type: "LIMIT_REACHED_NOTES",
      message: `Quick note limit exceeded. You can have up to ${limits.notes.maxCount} notes on your current plan.`,
      meta: {
        current: currentCount,
        max: limits.notes.maxCount,
        limitType: "notes",
      },
    });
  }
};

export const getHubLimitMiddleware = async (context: { user: AuthUser }) => {
  if (context.user.subscriptionTier === "premium") return;

  const hubsCount = await db
    .select({ count: count() })
    .from(hub)
    .where(eq(hub.userId, context.user.id));

  const currentCount = hubsCount[0]?.count || 0;
  const limits = getPlanLimits(context.user.subscriptionTier);

  if (isAtLimit(currentCount, limits.hubs.maxCount)) {
    return createDataAccessError({
      type: "LIMIT_REACHED_HUBS",
      message: `Hub limit exceeded. You can have up to ${limits.hubs.maxCount} hubs on your current plan.`,
      meta: {
        current: currentCount,
        max: limits.hubs.maxCount,
        limitType: "hubs",
      },
    });
  }
};
