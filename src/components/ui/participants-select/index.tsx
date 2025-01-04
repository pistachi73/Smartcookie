import {
  ArrowExpand01Icon,
  ArrowShrink02Icon,
  Copy01Icon,
  Delete02Icon,
  Loading02Icon,
  UserAdd02Icon,
  UserIcon,
} from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { createContext, useState } from "react";
import { Group, Input, Button as RACButton } from "react-aria-components";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  ComboBoxField,
  ComboBoxFieldContent,
  type ComboBoxFieldProps,
} from "@/components/ui/react-aria/combobox";
import { ListBoxItem } from "@/components/ui/react-aria/list-box";
import { fieldWrapperVariants } from "@/components/ui/react-aria/shared-styles/field-variants";
import { cn } from "@/lib/utils";
import { regularSpring } from "@/utils/animation";

const TimezoneComboboxContext = createContext<{
  isOpen: boolean;
}>({
  isOpen: false,
});

type Participant = {
  id: number;
  name: string;
  email: string;
  image: string;
};

type ParticipantsSelectFieldProps<T extends Participant> = Omit<
  ComboBoxFieldProps<T>,
  "children"
> & {
  withIcon?: boolean;
  value: number[] | undefined;
  onChange: (participants: number[]) => void;
};

export const ParticipantsSelect = <T extends Participant>({
  className,
  isDisabled,
  selectedKey,
  value,
  onChange,
  ...props
}: ParticipantsSelectFieldProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const participants: Participant[] = [
    {
      id: 1,
      name: "Oscar Pulido",
      email: "oscarpulido98@gmail.com",
      image: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 2,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      image: "https://i.pravatar.cc/150?img=8",
    },
  ];

  const participantsMap = participants.reduce<Record<number, Participant>>(
    (acc, participant) => {
      acc[participant.id] = participant;
      return acc;
    },
    {},
  );

  const filteredParticipants = participants.filter(
    (participant) => !value?.includes(participant.id),
  );

  const isSomeParticipantsSelected = (value?.length ?? 0) > 0;
  const isComboboxDisabled = !filteredParticipants.length || isDisabled;
  const inputPlaceholder =
    filteredParticipants.length === 0
      ? "No more participants"
      : isSomeParticipantsSelected
        ? "Add participants"
        : "Participants";

  const isLoading = false;

  return (
    <TimezoneComboboxContext.Provider value={{ isOpen }}>
      <div className="flex flex-col gap-1">
        {value?.map((id) => {
          const participant = participantsMap[id]!;
          return (
            <SelectedParticipant
              key={participant.email}
              participant={participant}
              onRemove={() => {
                onChange(value.filter((id) => id !== participant.id));
              }}
            />
          );
        })}
        <div className="flex items-center w-full">
          <ComboBoxField
            selectedKey={null}
            isDisabled={isComboboxDisabled}
            inputValue={inputValue}
            onInputChange={(input) => {
              setInputValue(input);
              setIsOpen(true);
            }}
            allowsEmptyCollection
            onSelectionChange={(id) => {
              if (!id) return;
              setInputValue("");
              onChange([...(value ?? []), id as number]);
              setIsOpen(false);
            }}
            onOpenChange={(open, trigger) => {
              console.log({ open, trigger });
              setIsOpen(open);
            }}
            className={cn("flex-1", isSomeParticipantsSelected && "ml-7")}
            {...props}
          >
            <Group
              className={cn(
                fieldWrapperVariants({
                  size: "sm",
                  isDisabled: isComboboxDisabled,
                }),
                "relative pl-0",
                className,
              )}
            >
              {isLoading || !isSomeParticipantsSelected ? (
                <RACButton
                  className={cn(
                    "absolute top-0 left-0",
                    "h-full aspect-square p-0 rounded-none",
                    "flex items-center justify-center",
                  )}
                >
                  {isLoading ? (
                    <Loading02Icon
                      size={16}
                      variant="bulk"
                      strokeWidth={0}
                      className="animate-spin"
                      color="var(--color-text-sub)"
                    />
                  ) : (
                    <UserIcon size={16} color="var(--color-text-sub)" />
                  )}
                </RACButton>
              ) : null}

              <Input
                className={cn(
                  "relative z-10 flex-1 h-full truncate",
                  isSomeParticipantsSelected ? "pl-3" : "pl-10",
                )}
                placeholder={inputPlaceholder}
              />
            </Group>

            <ComboBoxFieldContent
              isOpen={isOpen}
              placement="left top"
              items={filteredParticipants}
              className={"min-w-[300px]"}
              offset={6}
            >
              {({ id, name, image, email }) => (
                <ListBoxItem
                  key={id}
                  id={id}
                  textValue={`${name} ${email}`}
                  className="flex flex-row gap-1"
                >
                  <Image
                    className="rounded-full"
                    src={image}
                    alt={name}
                    width={32}
                    height={32}
                  />
                  <div>
                    <p>{name}</p>
                    <p className="text-text-sub text-xs">{email}</p>
                  </div>
                </ListBoxItem>
              )}
            </ComboBoxFieldContent>
          </ComboBoxField>
          {filteredParticipants.length === 0 && (
            <Link
              href={"/account/participants/new"}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "ghost",
                }),
                "min-w-0 rounded-lg h-8 font-normal",
              )}
            >
              <span className="text-xs">Create</span>
              <UserAdd02Icon size={14} />
            </Link>
          )}
        </div>
      </div>
    </TimezoneComboboxContext.Provider>
  );
};

export const SelectedParticipant = ({
  participant,
  onRemove,
}: {
  participant: Participant;
  onRemove: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      className={cn(
        "group pr-1 flex flex-col justify-between rounded-lg hover:bg-base-highlight transition-colors",
        isExpanded && "bg-base-highlight",
      )}
    >
      <div className="flex flex-row items-center justify-between gap-2 shrink-0 h-9">
        <div className="flex flex-row items-center h-full">
          <div className="shrink-0 w-10 h-full relative flex items-center justify-center">
            <Image
              className="rounded-full shrink-0 aspect-square"
              src={participant.image}
              alt={participant.name}
              width={20}
              height={20}
            />
          </div>
          <p className="text-sm">{participant.name}</p>
        </div>
        <div className="group-hover:opacity-100 transition-opacity opacity-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-sub hover:bg-transparent p-0 size-7"
            onPress={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? (
              <ArrowShrink02Icon size={14} />
            ) : (
              <ArrowExpand01Icon size={14} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-text-sub hover:bg-transparent p-0 size-7 hover:text-destructive"
            onPress={onRemove}
          >
            <Delete02Icon size={14} />
          </Button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={regularSpring}
            className="ml-10 overflow-hidden"
          >
            <div className="flex items-center gap-1 pb-2">
              <p className="text-text-sub text-xs">{participant.email}</p>
              <Button
                variant="ghost"
                size="sm"
                slot="close"
                className="text-text-sub hover:bg-transparent p-0 h-auto"
                onPress={() => {
                  navigator?.clipboard?.writeText(participant.email);
                  toast.info("Copied to clipboard", {
                    description: `"${participant.email}"`,
                    position: "bottom-right",
                  });
                }}
              >
                <Copy01Icon size={12} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
