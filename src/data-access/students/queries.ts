"use server";

import { and, asc, count, eq, ilike, or, sql } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { attendance, session, student, studentHub } from "@/db/schema";
import {
  withAuthenticationNoInput,
  withValidationAndAuth,
} from "../protected-data-access";
import {
  GetPaginatedUserStudentsSchema,
  GetStudentByIdSchema,
  GetStudentsByHubIdSchema,
} from "./schemas";

const buildSearchCondition = (q?: string) => {
  if (!q || q.trim() === "") {
    return undefined;
  }
  const searchTerm = `%${q}%`;
  return or(ilike(student.name, searchTerm), ilike(student.email, searchTerm));
};

// Cached function to get the total count of students for a user
const getCachedStudentCount = cache(async (userId: string, q?: string) => {
  const userCondition = eq(student.userId, userId);
  const whereCondition =
    q && q.trim() !== ""
      ? and(userCondition, buildSearchCondition(q))
      : userCondition;

  const countResult = await db
    .select({ value: count() })
    .from(student)
    .where(whereCondition);
  return countResult[0]?.value || 0;
});

export const getStudentsByHubId = withValidationAndAuth({
  schema: GetStudentsByHubIdSchema,
  callback: async ({ hubId }) => {
    const hubStudents = await db
      .select({
        id: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
        completedSessions:
          sql<number>`count(case when ${session.status} = 'completed' then ${attendance.id} end)`.as(
            "completedSessions",
          ),
        presentSessions:
          sql<number>`count(case when ${session.status} = 'completed' and ${attendance.status} = 'present' then 1 end)`.as(
            "presentSessions",
          ),
      })
      .from(student)
      .leftJoin(studentHub, eq(studentHub.studentId, student.id))
      .leftJoin(attendance, eq(student.id, attendance.studentId))
      .leftJoin(
        session,
        and(eq(attendance.sessionId, session.id), eq(session.hubId, hubId)),
      )
      .where(eq(studentHub.hubId, hubId))
      .groupBy(student.id, student.name);

    return hubStudents;
  },
});

export const getStudentsByUserId = withAuthenticationNoInput({
  callback: async (user) => {
    const students = await db
      .select({
        id: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
      })
      .from(student)
      .where(eq(student.userId, user.id));
    return students;
  },
});

export const getPaginatedUserStudents = withValidationAndAuth({
  schema: GetPaginatedUserStudentsSchema,
  callback: async ({ page, pageSize, q }, user) => {
    // Base condition for current user's students
    const userCondition = eq(student.userId, user.id);
    const whereCondition =
      q && q.trim() !== ""
        ? and(userCondition, buildSearchCondition(q))
        : userCondition;

    // Get the students with pagination and alphabetical sorting
    const [studentResults, totalCount] = await Promise.all([
      db
        .select({
          id: student.id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          location: student.location,
          nationality: student.nationality,
          job: student.job,
          status: student.status,
          birthDate: student.birthDate,
          motherLanguage: student.motherLanguage,
          learningLanguage: student.learningLanguage,
          image: student.image,
          interests: student.interests,
          age: student.age,
        })
        .from(student)
        .where(whereCondition)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(asc(student.name)), // Alphabetical sorting (A-Z)
      getCachedStudentCount(user.id, q),
    ]);

    return {
      students: studentResults,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  },
});

export const getStudentById = withValidationAndAuth({
  schema: GetStudentByIdSchema,
  callback: async ({ id }, user) => {
    const res = await db.query.student.findFirst({
      where: and(eq(student.id, id), eq(student.userId, user.id)),
      with: {
        studentHub: {
          columns: {
            id: true,
          },
          with: {
            hub: {
              columns: {
                id: true,
                name: true,
                color: true,
                status: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!res) return null;

    const { studentHub, ...studentData } = res;

    const formattedStudent = {
      ...studentData,
      hubs: studentHub?.map((sh) => ({
        ...sh.hub,
        color: sh.hub.color,
        status: sh.hub.status,
      })),
    };

    return formattedStudent;
  },
});
