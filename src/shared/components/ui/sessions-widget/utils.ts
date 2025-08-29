import { differenceInMinutes } from "date-fns";

import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";

const TIMELINE_WIDTH = 1600;
const HOUR_WIDTH = TIMELINE_WIDTH / 24;

export const calculateSessionLeft = (date: Date): number => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalHours = hours + minutes / 60;
  return (totalHours / 24) * TIMELINE_WIDTH;
};

export const formatSessionTimeStatus = (
  sessionStart: Date,
  sessionEnd: Date,
  currentTime: Date,
): string => {
  // Check if session is happening now
  if (currentTime >= sessionStart && currentTime <= sessionEnd) {
    return "Now";
  }

  // Session is in the future
  console.log({ sessionStart, currentTime });
  if (currentTime < sessionStart) {
    const diffMins = differenceInMinutes(sessionStart, currentTime);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    if (hours === 0) {
      return `Time until next session: ${minutes}m`;
    }
    if (minutes === 0) {
      return `Time until next session: ${hours}h`;
    }
    return `Time until next session: ${hours}h ${minutes}m`;
  }

  const diffMins = differenceInMinutes(sessionEnd, currentTime);
  const hours = Math.abs(Math.floor(diffMins / 60));
  const minutes = Math.abs(diffMins % 60);

  if (diffMins > 5) {
    return "Just finished";
  }
  if (diffMins > 60) {
    return `Finished ${minutes}m ago`;
  }
  if (minutes === 0) {
    return `Finished ${hours}h ago`;
  }
  return `Finished ${hours}h ${minutes}m ago`;
};

export const getFilteredSession = (
  sessions: LayoutCalendarSession[],
  hubIds?: number[],
) => {
  const filteredSessions = hubIds
    ? sessions.filter((session) => hubIds.includes(session.hub.id))
    : sessions;
  return filteredSessions;
};

export const getSessionsWithPositions = (sessions: LayoutCalendarSession[]) =>
  getFilteredSession(sessions).map((session) => {
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);

    console.log({ startTime, endTime });

    const left = calculateSessionLeft(startTime);
    const endLeft = calculateSessionLeft(endTime);
    const width = endLeft - left;

    return {
      session,
      left: left + HOUR_WIDTH / 2,
      width,
    };
  });

export const getSessionTimeStatus = (
  sessions: any[],
  focusedIndex: number,
  currentTime: Date,
) => {
  const currentSession = sessions[focusedIndex];
  if (!currentSession) return "";

  console.log({ currentSession });

  const sessionStart = new Date(currentSession.startTime);
  const sessionEnd = new Date(currentSession.endTime);

  return formatSessionTimeStatus(sessionStart, sessionEnd, currentTime);
};
