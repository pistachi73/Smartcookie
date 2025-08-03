import { format } from "date-fns";
import { create } from "zustand";

import { calculateOccurrenceTop } from "../lib/utils";

interface CurrentTimeState {
  now: Date;
  label: string;
  top: number;
  subscribers: number;
  startTimer: () => void;
  stopTimer: () => void;
  subscribe: () => () => void;
}

let timerId: number | null = null;

const updateTime = (
  set: (fn: (state: CurrentTimeState) => Partial<CurrentTimeState>) => void,
) => {
  const now = new Date();
  const label = format(now, "HH:mm");
  const top = calculateOccurrenceTop({
    hours: now.getHours(),
    minutes: now.getMinutes(),
  });

  set(() => ({ now, label, top }));

  // Schedule next update at the start of the next minute
  const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
  timerId = window.setTimeout(() => updateTime(set), delay);
};

export const useCurrentTimeStore = create<CurrentTimeState>((set, get) => ({
  now: new Date(),
  label: format(new Date(), "HH:mm"),
  top: calculateOccurrenceTop({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
  }),
  subscribers: 0,

  startTimer: () => {
    if (timerId === null) {
      updateTime(set);
    }
  },

  stopTimer: () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  },

  subscribe: () => {
    const state = get();
    const newSubscriberCount = state.subscribers + 1;

    set({ subscribers: newSubscriberCount });

    // Start timer when first subscriber joins
    if (newSubscriberCount === 1) {
      state.startTimer();
    }

    // Return unsubscribe function
    return () => {
      const currentState = get();
      const newCount = currentState.subscribers - 1;

      set({ subscribers: newCount });

      // Stop timer when last subscriber leaves
      if (newCount === 0) {
        currentState.stopTimer();
      }
    };
  },
}));
