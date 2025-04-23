interface StudentPageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { studentId } = await params;
  return <div>Student {studentId}</div>;
}
