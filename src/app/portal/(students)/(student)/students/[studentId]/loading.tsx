import { StudentProfileLayout } from "@/features/students/components/student-profile-detail/student-profile-layout";

export default function StudentPageLoading() {
  return (
    <StudentProfileLayout isLoading={true}>
      <p>Loading...</p>
    </StudentProfileLayout>
  );
}
