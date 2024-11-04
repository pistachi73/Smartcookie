import type { InsertClient } from "@/db/schema";

type InsertClientExtended = InsertClient & {
  hubs: number[];
};

const clients: Omit<InsertClientExtended, "salt">[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    password: "password",
    paymentFrequency: "monthly",
    location: "New York, USA",
    nationality: "American",
    age: 30,
    timeInvestment: "medium",
    job: "Graphic Designer",
    hubs: [1, 2], // Added to multiple hubs
  },
  {
    id: 2,
    name: "Mohamed Ali",
    email: "mohamed.ali@example.com",
    password: "password",
    paymentFrequency: "monthly",
    location: "Cairo, Egypt",
    nationality: "Egyptian",
    age: 25,
    timeInvestment: "high",
    job: "Software Engineer",
    hubs: [2],
  },
  {
    id: 3,
    name: "Liam Smith",
    email: "liam.smith@example.com",
    password: "password",
    paymentFrequency: "one-time",
    location: "Sydney, Australia",
    nationality: "Australian",
    age: 35,
    timeInvestment: "low",
    job: "Project Manager",
    hubs: [3],
  },
  {
    id: 4,
    name: "Sofia García",
    email: "sofia.garcia@example.com",
    password: "password",
    paymentFrequency: "monthly",
    location: "Madrid, Spain",
    nationality: "Spanish",
    age: 28,
    timeInvestment: "medium",
    job: "Marketing Specialist",
    hubs: [1, 3], // Added to multiple hubs
  },
  {
    id: 5,
    name: "Raj Patel",
    email: "raj.patel@example.com",
    password: "password",
    paymentFrequency: "one-time",
    location: "Mumbai, India",
    nationality: "Indian",
    age: 32,
    timeInvestment: "high",
    job: "Data Scientist",
    hubs: [2, 3], // Added to multiple hubs
  },
  {
    id: 6,
    name: "Emma Zhang",
    email: "emma.zhang@example.com",
    password: "password",
    paymentFrequency: "monthly",
    location: "Shanghai, China",
    nationality: "Chinese",
    age: 31,
    timeInvestment: "medium",
    job: "Financial Analyst",
    hubs: [3],
  },
  {
    id: 7,
    name: "Carlos Mendes",
    email: "carlos.mendes@example.com",
    password: "password",
    paymentFrequency: "monthly",
    location: "São Paulo, Brazil",
    nationality: "Brazilian",
    age: 36,
    timeInvestment: "high",
    job: "Teacher",
    hubs: [1],
  },
];

export default clients;
