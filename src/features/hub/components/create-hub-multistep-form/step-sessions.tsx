"use client";

import { Button } from "@/shared/components/ui/button";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Form } from "@/shared/components/ui/form";
import { TextField } from "@/shared/components/ui/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { type SessionData, useHubFormStore } from "../../store/hub-form-store";

// Schema for session form
const sessionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.date(),
  duration: z.number().min(5, "Duration must be at least 5 minutes"),
  location: z.string().optional(),
});

type SessionFormValues = z.infer<typeof sessionSchema>;

export function StepSessions() {
  const sessions = useHubFormStore((state) => state.sessions);
  const addSession = useHubFormStore((state) => state.addSession);
  const removeSession = useHubFormStore((state) => state.removeSession);
  const setStepValidation = useHubFormStore((state) => state.setStepValidation);

  // For demo purposes, automatically mark this step as valid
  useEffect(() => {
    setStepValidation("sessionsValid", true);
  }, [setStepValidation]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Add Sessions</h3>
        <div className="bg-muted/40 p-4 rounded-md">
          <p className="text-sm text-muted-foreground mb-2">
            Add recurring sessions for this hub. These will be used to track
            attendance and progress.
          </p>
          <SessionForm onAddSession={addSession} />
        </div>
      </div>

      {sessions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Added Sessions</h3>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-card rounded-md"
              >
                <div>
                  <p className="font-medium">{session.title}</p>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>
                      {session.date.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{session.duration} minutes</span>
                    {session.location && (
                      <>
                        <span>•</span>
                        <span>{session.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <Button onPress={() => removeSession(session.id)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Form for adding a session
function SessionForm({
  onAddSession,
}: {
  onAddSession: (session: SessionData) => void;
}) {
  const { control, handleSubmit, reset } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      duration: 60,
      location: "",
    },
  });

  const onSubmit = (data: SessionFormValues) => {
    onAddSession({
      id: "a",
      ...data,
    });
    reset();
  };

  // Convert JavaScript Date to CalendarDate for DatePicker
  const todayDate = today(getLocalTimeZone());

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="Title"
              placeholder="Weekly Class"
              isRequired
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="date"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Date"
                isRequired
                className={{
                  primitive: "w-full",
                }}
                value={
                  value
                    ? new CalendarDate(
                        value.getFullYear(),
                        value.getMonth() + 1,
                        value.getDate(),
                      )
                    : todayDate
                }
                onChange={(date) => {
                  if (date) {
                    const jsDate = new Date(
                      date.year,
                      date.month - 1,
                      date.day,
                    );
                    onChange(jsDate);
                  }
                }}
              />
            )}
          />

          <Controller
            name="duration"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label="Duration (minutes)"
                type="number"
                isRequired
                errorMessage={fieldState.error?.message}
                value={String(field.value)}
                onChange={(e) => {
                  // Convert the string value to a number
                  const value = e ? Number.parseInt(e, 10) : 0;
                  field.onChange(value);
                }}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />
        </div>

        <Controller
          name="location"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              label="Location"
              placeholder="Room 101 or Zoom link"
              errorMessage={fieldState.error?.message}
              {...field}
            />
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Add Session</Button>
        </div>
      </div>
    </Form>
  );
}
