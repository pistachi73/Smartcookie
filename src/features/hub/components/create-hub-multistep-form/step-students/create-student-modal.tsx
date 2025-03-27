// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

// const studentFormSchema = z.object({
//   name: z.string(),
//   email: z.string().email(),
//   phone: z.string(),
// });

// // Mock form for adding a student
// export const CreateStudentModal = () => {
//   const { control, handleSubmit, reset } = useForm<StudentFormValues>({
//     resolver: zodResolver(studentSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       image: null,
//     },
//   });

//   const onSubmit = (data: StudentFormValues) => {
//     onAddStudent(data);
//     reset();
//   };

//   return (
//     <Form onSubmit={handleSubmit(onSubmit)}>
//       <div className="space-y-4">
//         <Controller
//           name="name"
//           control={control}
//           render={({ field, fieldState }) => (
//             <TextField
//               label="Name"
//               placeholder="John Doe"
//               isRequired
//               errorMessage={fieldState.error?.message}
//               {...field}
//             />
//           )}
//         />

//         <Controller
//           name="email"
//           control={control}
//           render={({ field, fieldState }) => (
//             <TextField
//               label="Email"
//               placeholder="john@example.com"
//               isRequired
//               errorMessage={fieldState.error?.message}
//               {...field}
//             />
//           )}
//         />

//         <div className="flex justify-end">
//           <Button type="submit">Add Student</Button>
//         </div>
//       </div>
//     </Form>
//   );
// };
