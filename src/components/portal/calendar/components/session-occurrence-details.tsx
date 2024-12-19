"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/react-aria/modal";
import { Radio, RadioGroup } from "@/components/ui/react-aria/radio-group";
import { Sheet } from "@/components/ui/react-aria/sheet";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { SessionOccurrence } from "@/lib/generate-session-ocurrences";
import { cn } from "@/lib/utils";
import {
  Calendar02Icon,
  Clock01Icon,
  Delete02Icon,
  Edit02Icon,
  RepeatIcon,
  UserGroupIcon,
} from "@hugeicons/react";
import { format } from "date-fns";
import { Dialog, DialogTrigger, Header } from "react-aria-components";
import { useCalendarContext } from "../calendar-context";
import { SessionUpdateForm } from "./session-update-form";

type SessionOccurrenceDetailsProps = {
  occurrence: SessionOccurrence;
};

export const SessionOccurrenceDetails = ({
  occurrence,
}: SessionOccurrenceDetailsProps) => {
  const { hubsMap } = useCalendarContext();

  const sessionOccurrenceHub = hubsMap?.[occurrence.hubId];

  if (!sessionOccurrenceHub) return null;

  const isRecurrent = Boolean(occurrence.recurrenceRule);
  return (
    <div
      className={cn(
        "flex flex-col p-2 py-3 pl-8 pr-3 w-[400px] relative",
        "after:absolute after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-2 after:h-[calc(100%-calc(var(--spacing)*6))] after:w-[3px] after:bg-[#30EEAC] after:content-['']",
      )}
    >
      <div className="flex items-center justify-end gap-1">
        <DialogTrigger>
          <Button
            variant="ghost"
            iconOnly
            size={"sm"}
            className="hover:bg-background-base-highlight hover:text-responsive-dark size-9"
          >
            <Edit02Icon size={18} variant="stroke" />
          </Button>
          <Sheet side="right" isDismissable>
            <Dialog className="relative p-8">
              <SessionUpdateForm sessionOcurrence={occurrence} />
            </Dialog>
          </Sheet>
        </DialogTrigger>
        <DialogTrigger>
          <Button
            variant="ghost"
            iconOnly
            size={"sm"}
            className="hover:bg-background-base-highlight hover:text-responsive-dark size-9"
          >
            <Delete02Icon size={18} variant="stroke" />
          </Button>
          {isRecurrent ? (
            <DeleteRecurrentSessionModal />
          ) : (
            <DeleteIndividualSessionModal />
          )}
        </DialogTrigger>
      </div>
      <p className="text-lg font-semibold text-responsive-dark mb-2">
        {sessionOccurrenceHub.name}
      </p>

      <div className="space-y-4 mt-0">
        <div className="space-y-1">
          <p className="text-base font-medium">{occurrence.title}</p>
          <p className="text-base text-text-sub line-clamp-2 font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            ullamcorper, nisl in commodo egestas, sem eros blandit nisi, vitae
            tincidunt nisi nisl sit amet elit. Sed ullamcorper, nisl in.
          </p>
        </div>
        <div className="flex flex-row items-start gap-6">
          <div className="space-y-1 basis-1/2">
            <div className="flex items-center gap-1">
              <Calendar02Icon size={14} />
              <span className="text-text-sub text-sm">Date</span>
            </div>
            <p className="text-base font-medium">
              {format(occurrence.startTime, "iiii, d MMMM")}
            </p>
          </div>
          <div className="space-y-1 basis-1/2">
            <div className="flex items-center gap-1">
              <Clock01Icon size={14} />
              <span className="text-text-sub text-sm">Time</span>
            </div>
            <p className="text-base font-medium">
              {format(occurrence.startTime, "HH:mm")} -{" "}
              {format(occurrence.endTime, "HH:mm")}
            </p>
          </div>
        </div>
        {occurrence.recurrenceRule && (
          <div className="space-y-1 ">
            <div className="flex items-center gap-1">
              <RepeatIcon size={14} />
              <span className="text-text-sub text-sm">Recurrence</span>
            </div>
            <p className="text-base font-medium">
              <span className="capitalize">
                {" "}
                {occurrence.recurrenceRule.frequency}
              </span>
              {occurrence.recurrenceRule.endDate && (
                <span>
                  , until{" "}
                  {format(
                    occurrence.recurrenceRule.endDate,
                    "iiii, d MMMM, yyyy",
                  )}
                </span>
              )}
            </p>
          </div>
        )}
        <div className="space-y-1 ">
          <div className="flex items-center gap-1">
            <UserGroupIcon size={14} />
            <span className="text-text-sub text-sm">Participants</span>
          </div>
          <div className="flex items-center">
            <UserAvatar
              size="sm"
              className="not-first:-ml-2 size-7"
              userImage={"https://i.pravatar.cc/150?img=3"}
            />
            <UserAvatar
              userImage={"https://i.pravatar.cc/150?img=1"}
              size="sm"
              className="not-first:-ml-2 size-7"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteRecurrentSessionModal = () => {
  return (
    <Modal isDismissable className="w-fit">
      <Dialog className="p-6">
        <Header className="text-2xl mb-5">Delete recurrent session</Header>

        <RadioGroup>
          <Radio value="all">This session</Radio>
          <Radio value="this">This session and later ones</Radio>
          <Radio value="future">All sessions</Radio>
        </RadioGroup>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" slot="close">
            Cancel
          </Button>
          <Button variant="destructive" size="sm" className="px-6">
            Delete
          </Button>
        </div>
      </Dialog>
    </Modal>
  );
};

const DeleteIndividualSessionModal = () => {
  return (
    <Modal isDismissable>
      <Dialog className="p-6">
        <Header className="text-3xl mb-3">Delete session?</Header>
        <p className="text-base text-text-sub">
          Are you sure you want to delete this session?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" slot="close">
            Cancel
          </Button>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </div>
      </Dialog>
    </Modal>
  );
};
