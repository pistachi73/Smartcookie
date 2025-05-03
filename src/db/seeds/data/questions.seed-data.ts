import type { InsertQuestion } from "@/db/schema/questions";

const questionsSeedData: Omit<InsertQuestion, "userId">[] = [
  {
    title: "How would you rate your progress in the classes?",
    type: "rating",
    enableAdditionalComment: true,
  },
  {
    title: "What is your current level of motivation regarding the classes?",
    type: "rating",
    enableAdditionalComment: true,
  },
  {
    title:
      "Do you have any suggestions or comments on how the classes could be improved?",
    type: "text",
    enableAdditionalComment: false,
  },
];

export default questionsSeedData;
