import {
  ArrowExpand01Icon,
  ArrowShrink02Icon,
  Copy01Icon,
  Delete02Icon,
  UserAdd02Icon,
} from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { regularSpring } from "@/utils/animation";
import {
  Button,
  ComboBox,
  type ComboBoxListProps,
  type ComboBoxProps,
  DropdownLabel,
  Link,
  buttonStyles,
} from "../new/ui";

type Participant = {
  id: number;
  name: string;
  email: string;
  image: string;
};

type ParticipantsComboboxFieldProps<T extends Participant> = Omit<
  ComboBoxProps<T>,
  "children" | "className"
> & {
  value: number[] | undefined;
  onChange: (participants: number[]) => void;
  withIcon?: boolean;
  className?: {
    primitive?: string;
    input?: string;
    fieldGroup?: string;
    overlay?: string;
  };
  listProps?: ComboBoxListProps<T>;
};

export const ParticipantsCombobox = <T extends Participant>({
  className,
  isDisabled,
  selectedKey,
  value,
  withIcon = true,
  listProps,
  onChange,
  ...props
}: ParticipantsComboboxFieldProps<T>) => {
  const comboboxPrimitiveRef = useRef<HTMLDivElement>(null);
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

  const isSomeParticipantsComboboxed = (value?.length ?? 0) > 0;
  const isComboboxDisabled = !filteredParticipants.length || isDisabled;
  const inputPlaceholder =
    filteredParticipants.length === 0
      ? "No more participants"
      : "Add participants...";

  const isLoading = false;

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="flex items-center w-full gap-2"
        ref={comboboxPrimitiveRef}
      >
        <ComboBox
          selectedKey={null}
          isDisabled={isComboboxDisabled}
          inputValue={inputValue}
          menuTrigger="focus"
          onInputChange={(input) => {
            setInputValue(input);
            setIsOpen(true);
          }}
          allowsEmptyCollection
          onSelectionChange={(id) => {
            if (!id) return;
            setInputValue("");
            onChange([...(value ?? []), id as number]);
            // setIsOpen(false);
          }}
          onOpenChange={(open, trigger) => {
            console.log({ open, trigger });
            setIsOpen(open);
          }}
          className={cn("flex-1")}
          {...props}
        >
          <ComboBox.Input
            prefix={
              !isComboboxDisabled && (
                <UserAdd02Icon
                  size={14}
                  data-slot="icon"
                  className="shrink-0"
                />
              )
            }
            className={{
              input: cn(className?.input),
              fieldGroup: className?.fieldGroup,
              icon: isOpen ? "rotate-180 text-fg" : "text-muted-fg",
            }}
            placeholder={inputPlaceholder}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
              }
            }}
          />
          <ComboBox.List
            isOpen={isOpen}
            placement="left top"
            offset={8}
            items={filteredParticipants}
            triggerRef={comboboxPrimitiveRef}
          >
            {(item) => (
              <ComboBox.Option
                key={item.id}
                id={item.id}
                textValue={`${item.name} ${item.email}`}
                isDisabled={isComboboxDisabled}
              >
                <DropdownLabel className="flex flex-row gap-1 items-center">
                  <Image
                    className="rounded-full shrink-0 size-8"
                    src={item.image}
                    alt={item.name}
                    width={32}
                    height={32}
                  />
                  <div>
                    <p>{item.name}</p>
                    <p className="text-muted-fg text-xs">{item.email}</p>
                  </div>
                </DropdownLabel>
              </ComboBox.Option>
            )}
          </ComboBox.List>
        </ComboBox>
        {filteredParticipants.length === 0 && (
          <Link
            href={"/account/participants/new"}
            className={cn(
              buttonStyles({
                size: "small",
                appearance: "plain",
              }),
              "min-w-0 rounded-lg font-normal",
            )}
          >
            <span className="text-xs">Create</span>
            <UserAdd02Icon size={14} />
          </Link>
        )}
      </div>
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
    </div>
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
        "group pr-1 flex flex-col justify-between rounded-lg hover:bg-overlay-highlight transition-colors",
        isExpanded && "bg-overlay-highlight",
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
            appearance="plain"
            size="small"
            shape="square"
            className="p-0 size-7"
            onPress={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? (
              <ArrowShrink02Icon size={14} />
            ) : (
              <ArrowExpand01Icon size={14} />
            )}
          </Button>
          <Button
            appearance="plain"
            size="square-petite"
            shape="square"
            className="p-0 size-7"
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
                appearance="plain"
                size="small"
                slot="close"
                className="text-muted-fg hover:bg-transparent p-0 h-auto"
                onPress={() => {
                  navigator?.clipboard?.writeText(participant.email);
                  toast.info("Copied to clipboard", {
                    description: `"${participant.email}"`,
                    position: "bottom-left",
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
