"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/react-aria/date-picker";
import { ListBoxItem } from "@/components/ui/react-aria/list-box";
import { NumberField } from "@/components/ui/react-aria/number-field";
import {
  SelectField,
  SelectFieldContent,
} from "@/components/ui/react-aria/select-field";
import { TextField } from "@/components/ui/react-aria/text-field";
import { TimeField } from "@/components/ui/react-aria/time-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Time } from "@internationalized/date";
import {
  type DateValue,
  Form,
  SelectValue,
  type TimeValue,
} from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z
  .object({
    name: z.string({ required_error: "Name is required" }),
    age: z.number(),
    time: z.custom<TimeValue>(),
    date: z.custom<DateValue>(),
    country: z.string({ required_error: "Country is required" }),
  })
  .refine(({ time }) => time?.hour > 8, {
    path: ["time"],
    message: "Time must be after 8",
  });

export const TestForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      time: new Time(2, 30),
      country: undefined,
    },
    mode: "onBlur",
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    console.log(values);
  };

  return (
    <Form
      className="space-y-4 w-[300px]"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState: { error, invalid } }) => (
          <TextField
            {...field}
            size={"sm"}
            label="Name"
            aria-label="Name"
            placeholder="John Doe"
            validationBehavior="aria"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="age"
        render={({ field, fieldState: { error, invalid } }) => (
          <NumberField
            {...field}
            size={"sm"}
            label="Age"
            minValue={1}
            placeholder="Age"
            aria-label="Age"
            validationBehavior="aria"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="time"
        render={({ field, fieldState: { error, invalid } }) => (
          <TimeField
            {...field}
            label="Time"
            validationBehavior="aria"
            size={"sm"}
            aria-label="Time"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="country"
        render={({
          field: { onChange, ...restField },
          fieldState: { error, invalid },
        }) => (
          <SelectField
            {...restField}
            onSelectionChange={onChange}
            label="Time"
            aria-label="Country"
            validationBehavior="aria"
            isInvalid={invalid}
            errorMessage={error?.message}
          >
            <Button size={"sm"} variant={"outline"}>
              <SelectValue className="data-[placeholder]:text-neutral-500" />
            </Button>
            <SelectFieldContent
              className="min-w-[var(--trigger-width)]"
              items={[
                {
                  value: "US",
                  label: "United States",
                },
                {
                  value: "CA",
                  label: "Canada",
                },
              ]}
            >
              {(item) => (
                <ListBoxItem id={item.value}>{item.label}</ListBoxItem>
              )}
            </SelectFieldContent>
          </SelectField>
        )}
      />
      <Controller
        control={form.control}
        name="date"
        render={({ field, fieldState: { invalid, error } }) => (
          <DatePicker
            {...field}
            // size={"sm"}
            label="Date"
            aria-label="Date"
            validationBehavior="aria"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};
