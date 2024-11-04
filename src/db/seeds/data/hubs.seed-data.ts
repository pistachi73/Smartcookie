import type { InsertHub } from "@/db/schema";

const hubs: InsertHub[] = [
  {
    id: 1,
    name: "Math Tutoring Hub",
    description:
      "A hub for all things math, from basic arithmetics to complex calculus.",
    scheduleType: "recurrent",
    defaultSessionPrice: 50,
    cancelationPolicyHours: 24,
  },
  {
    id: 2,
    name: "Language Learning Hub",
    description:
      "Dedicated to teaching a variety of languages with experienced tutors.",
    scheduleType: "on-demand",
    defaultSessionPrice: 40,
    cancelationPolicyHours: 48,
  },
  {
    id: 3,
    name: "Science Exploration Hub",
    description:
      "Explore the world of science with hands-on experiments and engaging lessons.",
    scheduleType: "recurrent",
    defaultSessionPrice: 60,
    cancelationPolicyHours: 24,
  },
];

export default hubs;
