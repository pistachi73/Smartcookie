import type { InsertHub } from "@/db/schema";

const hubs: Omit<InsertHub, "userId">[] = [
  {
    id: 1,
    name: "Math Tutoring Hub",
    description:
      "A hub for all things math, from basic arithmetics to complex calculus.",
    scheduleType: "recurrent",
    defaultSessionPrice: 50,
    cancelationPolicyHours: 24,
    color: "blueberry",
  },
  {
    id: 2,
    name: "Language Learning Hub",
    description:
      "Dedicated to teaching a variety of languages with experienced tutors.",
    scheduleType: "on-demand",
    defaultSessionPrice: 40,
    cancelationPolicyHours: 48,
    color: "lavender",
  },
  {
    id: 3,
    name: "Science Exploration Hub",
    description:
      "Explore the world of science with hands-on experiments and engaging lessons.",
    scheduleType: "recurrent",
    defaultSessionPrice: 60,
    cancelationPolicyHours: 24,
    color: "sage",
  },
  {
    id: 4,
    name: "Music Lessons Hub",
    description:
      "Learn to play various musical instruments with professional musicians.",
    scheduleType: "recurrent",
    defaultSessionPrice: 55,
    cancelationPolicyHours: 24,
    color: "flamingo",
  },
  {
    id: 5,
    name: "Coding Bootcamp Hub",
    description:
      "Intensive programming courses for beginners and advanced students.",
    scheduleType: "on-demand",
    defaultSessionPrice: 70,
    cancelationPolicyHours: 48,
    color: "peacock",
  },
  {
    id: 6,
    name: "Art & Design Hub",
    description:
      "Express your creativity through various art forms and design techniques.",
    scheduleType: "recurrent",
    defaultSessionPrice: 45,
    cancelationPolicyHours: 24,
    color: "tangerine",
  },
  {
    id: 7,
    name: "Test Prep Hub",
    description:
      "Prepare for standardized tests with targeted strategies and practice.",
    scheduleType: "on-demand",
    defaultSessionPrice: 65,
    cancelationPolicyHours: 48,
    color: "grape",
  },
];

export default hubs;
