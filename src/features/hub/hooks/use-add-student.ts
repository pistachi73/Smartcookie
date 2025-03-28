import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addStudentAction } from "../actions";
import type { SelectStudent } from "../components/create-hub-multistep-form/step-students";
import { useHubFormStore } from "../store/hub-form-store";

export const useAddStudent = () => {
  const { addStudent, removeStudent, updateStudent } = useHubFormStore();
  const queryClient = useQueryClient();
  const user = useCurrentUser();

  return useMutation({
    mutationFn: addStudentAction,
    onMutate: (data) => {
      // Create a placeholder ID (negative to avoid collisions with real IDs)
      const placeholderId = -Math.floor(Math.random() * 10000);

      // Add to store with placeholder ID
      const optimisticStudent = {
        id: placeholderId,
        name: data.formData.name,
        email: data.formData.email,
        image: null,
      };

      addStudent(optimisticStudent);

      // Add to query cache with isSelected = true
      queryClient.setQueryData<SelectStudent[]>(
        ["user-students", user.id],
        (old) => {
          if (!old) return old;
          return [
            ...old,
            {
              ...optimisticStudent,
              isSelected: true,
            },
          ];
        },
      );

      // Return context for onError
      return { placeholderId };
    },
    onSuccess: (data, variables, context) => {
      if (!context || !data?.data) return;

      const student = data.data;
      const studentData = {
        id: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
      };

      updateStudent(context.placeholderId, studentData);

      // Update query cache with real data
      queryClient.setQueryData<SelectStudent[]>(
        ["user-students", user.id],
        (old) => {
          if (!old) return old;
          return old.map((student) => {
            if (student.id === context.placeholderId) {
              return {
                ...studentData,
                isSelected: true,
              };
            }
            return student;
          });
        },
      );

      toast.success("Student added successfully");
    },
    onError: (error, variables, context) => {
      if (context) {
        // Remove the optimistic entry if there was an error
        removeStudent(context.placeholderId);

        // Remove from query cache
        queryClient.setQueryData<SelectStudent[]>(
          ["user-students", user.id],
          (old) => {
            if (!old) return old;
            return old.filter(
              (student) => student.id !== context.placeholderId,
            );
          },
        );
      }

      toast.error(
        error instanceof Error ? error.message : "Failed to add student",
      );
    },
  });
};
