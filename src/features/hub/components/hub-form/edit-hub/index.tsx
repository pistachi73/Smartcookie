"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { FolderDetailsIcon } from "@hugeicons-pro/core-solid-rounded";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { CalendarDate } from "@internationalized/date";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Form } from "react-aria-components";
import { FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";

import { Button, buttonStyles } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Link } from "@/shared/components/ui/link";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";

import type { CustomColor } from "@/db/schema";
import { useUpdateHub } from "@/features/hub/hooks/use-update-hub";
import { getHubByIdQueryOptions } from "../../../lib/hub-query-options";
import { hubInfoSchema } from "../../../lib/schemas";
import { HubNotFound } from "../../hub-not-found";
import { HubFormLayout } from "../hub-form-layout";
import { EditHubForm } from "./edit-hub-form";

export const EditHub = ({ hubId }: { hubId: number }) => {
  const { data, error } = useSuspenseQuery(getHubByIdQueryOptions(hubId));
  const { mutate: updateHub, isPending: isUpdatingHub } = useUpdateHub();

  const startDate = data?.startDate ? new Date(data?.startDate) : undefined;
  const endDate = data?.endDate ? new Date(data?.endDate) : undefined;

  const form = useForm<z.infer<typeof hubInfoSchema>>({
    defaultValues: {
      color: data?.color as CustomColor,
      name: data?.name,
      startDate: startDate
        ? new CalendarDate(
            startDate?.getFullYear(),
            startDate?.getMonth() + 1,
            startDate?.getDate(),
          )
        : undefined,
      endDate: endDate
        ? new CalendarDate(
            endDate.getFullYear(),
            endDate.getMonth() + 1,
            endDate.getDate(),
          )
        : undefined,
      description: data?.description as string,
      level: data?.level ?? "",
      schedule: data?.schedule ?? "",
    },

    resolver: zodResolver(hubInfoSchema),
  });

  useEffect(() => {
    if (!data) return;
    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : undefined;
    form.reset({
      color: data?.color as CustomColor,
      name: data?.name,
      startDate: new CalendarDate(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
      ),
      endDate: endDate
        ? new CalendarDate(
            endDate.getFullYear(),
            endDate.getMonth() + 1,
            endDate.getDate(),
          )
        : undefined,
      description: data?.description as string,
      level: data?.level ?? "",
      schedule: data?.schedule ?? "",
    });
  }, [data, form.reset]);

  const onSubmit = (data: z.infer<typeof hubInfoSchema>) => {
    updateHub({
      hubId,
      data: {
        ...data,
        startDate: data.startDate?.toString(),
        endDate: data.endDate?.toString(),
      },
    });
  };

  if (error || !data) {
    return <HubNotFound />;
  }

  return (
    <HubFormLayout
      header="Edit course"
      subHeader="Edit your course with basic information. You can add students and sessions later."
      className="pb-22 sm:pb-0"
    >
      <Card className="w-full bg-overlay">
        <Card.Header className="flex flex-row items-center gap-3">
          <div className="size-10 sm:size-12 rounded-xl bg-primary-tint flex items-center justify-center">
            <HugeiconsIcon
              icon={FolderDetailsIcon}
              className="text-primary size-4 sm:size-5"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <Card.Title className="sm:text-xl font-semibold">
              Course Information
            </Card.Title>
            <Card.Description>
              Let's start with the basic information about your course.
            </Card.Description>
          </div>
        </Card.Header>
        <Separator />
        <Card.Content>
          <FormProvider {...form}>
            <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <EditHubForm isDisabled={isUpdatingHub} />
              <div
                className={cn(
                  "flex flex-row fixed bottom-0 border-t left-0 bg-overlay p-4 w-full",
                  "sm:relative sm:p-0 sm:flex-row sm:justify-end sm:border-none gap-2",
                )}
              >
                <Link
                  href={`/portal/hubs/${hubId}`}
                  className={buttonStyles({
                    intent: "outline",
                    size: "lg",
                  })}
                  isDisabled={isUpdatingHub}
                >
                  <HugeiconsIcon
                    icon={ArrowLeft02Icon}
                    size={16}
                    data-slot="icon"
                  />
                  Back to course
                </Link>
                <Button
                  type="submit"
                  className="px-6 w-full sm:w-fit items-center"
                  isDisabled={isUpdatingHub}
                >
                  {isUpdatingHub && (
                    <ProgressCircle
                      isIndeterminate
                      aria-label="Updating Course..."
                      className="size-4"
                    />
                  )}
                  Update Course
                </Button>
              </div>
            </Form>
          </FormProvider>
        </Card.Content>
      </Card>
    </HubFormLayout>
  );
};
