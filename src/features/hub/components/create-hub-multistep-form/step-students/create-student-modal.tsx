import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Modal } from "@/shared/components/ui/modal";
import { PhoneField } from "@/shared/components/ui/phone-field";
import { TextField } from "@/shared/components/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "libphonenumber-js/min";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useAddStudent } from "../../../hooks/use-add-student";

const studentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().refine(
    (phone) => {
      if (!phone) return true; // Allow empty phone
      try {
        return isValidPhoneNumber(phone);
      } catch (e) {
        return false;
      }
    },
    { message: "Please enter a valid phone number" },
  ),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface CreateStudentModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CreateStudentModal = ({
  isOpen,
  setIsOpen,
}: CreateStudentModalProps) => {
  const { mutate: addStudent } = useAddStudent();

  const { control, handleSubmit, reset, setError, clearErrors } =
    useForm<StudentFormValues>({
      resolver: zodResolver(studentFormSchema),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
      },
    });

  const onSubmit = (data: StudentFormValues) => {
    addStudent({
      formData: data,
    });
    reset();
    setIsOpen(false);
  };

  const handlePhoneValidityChange = (isValid: boolean) => {
    if (!isValid) {
      setError("phone", {
        type: "manual",
        message: "Please enter a valid phone number",
      });
    } else {
      clearErrors("phone");
    }
  };

  return (
    <Modal.Content
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isDismissable={false}
    >
      <Modal.Header
        title="Add New Student"
        description="You can add more details later."
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="py-1 min-h-full">
          <div className="space-y-4">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="Name"
                  placeholder="John Doe"
                  isRequired
                  validationBehavior="aria"
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="Email"
                  placeholder="john@example.com"
                  isRequired
                  validationBehavior="aria"
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <PhoneField
                  label="Phone Number"
                  value={field.value}
                  onChange={field.onChange}
                  onValidityChange={(isValid) =>
                    handlePhoneValidityChange(isValid)
                  }
                  validationBehavior="aria"
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Modal.Close size="small" appearance="outline" shape="square">
            Cancel
          </Modal.Close>
          <Button size="small" type="submit" shape="square" className="px-4">
            Add Student
          </Button>
        </Modal.Footer>
      </Form>
    </Modal.Content>
  );
};
