import { useParams } from "next/navigation";

import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useHubById } from "../hooks/use-hub-by-id";
import { StudentProfile } from "./create-hub-multistep-form/step-students/student-profile";

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
}

const mockStudents: Student[] = [
  {
    id: "A",
    name: "Alice Johnson",
    email: "alice@example.com",
    progress: 83,
  },
  {
    id: "B",
    name: "Bob Smith",
    email: "bob@example.com",
    progress: 92,
  },
  {
    id: "C",
    name: "Charlie Brown",
    email: "charlie@example.com",
    progress: 67,
  },
];

export function StudentsList() {
  const user = useCurrentUser();
  const params = useParams();

  const hubId = params.hubId as string;

  const { data: hub } = useHubById(Number(hubId));
  const students = hub?.students;

  return (
    <Card className="bg-overlay-highlight rounded-lg shadow-sm">
      <Card.Header className="p-4">
        <Heading level={2}>Students</Heading>
      </Card.Header>
      <Card.Content className="p-4 pt-0">
        <div className="flex flex-col gap-4">
          {students?.map((student) => (
            <StudentProfile
              className="bg-overlay-elevated p-2 border rounded-lg"
              key={student.id}
              name={student.name}
              email={student.email}
              image={student.image}
            />
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
