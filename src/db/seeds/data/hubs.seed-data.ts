import type { InsertHub } from "@/db/schema";

const hubs: Omit<InsertHub, "userId">[] = [
  {
    id: 1,
    name: "Math Tutoring Hub",
    description:
      "A hub for all things math, from basic arithmetics to complex calculus.",
    schedule: "Weekly on Mondays and Wednesdays, 4-6 PM",
    status: "active",
    color: "blueberry",
    level: "Intermediate",
    startDate: new Date("2023-01-01").toISOString(),
    endDate: new Date("2023-12-31").toISOString(),
  },
  {
    id: 2,
    name: "Language Learning Hub",
    description:
      "Dedicated to teaching a variety of languages with experienced tutors.",
    schedule: "Flexible scheduling based on availability",
    status: "active",
    color: "lavender",
    level: "Beginner",
    startDate: new Date("2023-01-15").toISOString(),
    endDate: new Date("2023-12-15").toISOString(),
  },
  {
    id: 3,
    name: "Science Exploration Hub",
    description:
      "Explore the world of science with hands-on experiments and engaging lessons.",
    schedule: "Biweekly on Saturdays, 10 AM-12 PM",
    status: "active",
    color: "sage",
    level: "Advanced",
    startDate: new Date("2023-02-01").toISOString(),
    endDate: new Date("2023-11-30").toISOString(),
  },
  {
    id: 4,
    name: "Music Lessons Hub",
    description:
      "Learn to play various musical instruments with professional musicians.",
    schedule: "Weekly on Tuesdays and Thursdays, 5-7 PM",
    status: "active",
    color: "flamingo",
    level: "Mixed",
    startDate: new Date("2023-01-10").toISOString(),
    endDate: new Date("2023-12-20").toISOString(),
  },
  {
    id: 5,
    name: "Coding Bootcamp Hub",
    description:
      "Intensive programming courses for beginners and advanced students.",
    schedule: "Weekdays, 6-8 PM",
    status: "active",
    color: "peacock",
    level: "Intermediate to Advanced",
    startDate: new Date("2023-03-01").toISOString(),
    endDate: new Date("2023-10-31").toISOString(),
  },
  {
    id: 6,
    name: "Art & Design Hub",
    description:
      "Express your creativity through various art forms and design techniques.",
    schedule: "Weekly on Fridays, 4-6 PM and Saturdays, 2-4 PM",
    status: "active",
    color: "tangerine",
    level: "All Levels",
    startDate: new Date("2023-01-20").toISOString(),
    endDate: new Date("2023-12-10").toISOString(),
  },
  {
    id: 7,
    name: "Test Prep Hub",
    description:
      "Prepare for standardized tests with targeted strategies and practice.",
    schedule: "On-demand scheduling with 48-hour notice",
    status: "active",
    color: "grape",
    level: "Advanced",
    startDate: new Date("2023-02-15").toISOString(),
    endDate: new Date("2023-11-15").toISOString(),
  },
];

export default hubs;
