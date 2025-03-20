import type { PgTimezone } from "@/data-access/pg";
import { cn } from "@/shared/lib/classes";

import { Globe02Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { getLocalTimeZone } from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ComboBox,
  type ComboBoxListProps,
  type ComboBoxProps,
  DropdownLabel,
} from "../";
import { getPgTimezonesAction } from "./actions";
type TimezoneComboboxProps<T extends object> = Omit<
  ComboBoxProps<T>,
  "className" | "children"
> & {
  withIcon?: boolean;
  className?: {
    primitive?: string;
    input?: string;
    fieldGroup?: string;
    overlay?: string;
  };
  listProps?: ComboBoxListProps<T>;
};

export const TimezoneCombobox = <T extends object>({
  className,
  isDisabled,
  selectedKey,
  withIcon = true,
  listProps,
  ...props
}: TimezoneComboboxProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { data: items, isLoading } = useQuery({
    queryKey: ["timezones"],
    queryFn: async () => {
      const res = await getPgTimezonesAction();
      return res?.data;
    },
    enabled: true,
  });

  const itemsMap = useMemo(
    () =>
      items?.reduce<Record<string, PgTimezone>>((acc, item) => {
        acc[item.name] = item;
        return acc;
      }, {}),
    [items],
  );

  return (
    <ComboBox
      onOpenChange={setIsOpen}
      menuTrigger="focus"
      isDisabled={isDisabled || isLoading}
      selectedKey={selectedKey}
      defaultSelectedKey={getLocalTimeZone()}
      onFocusChange={setIsFocused}
      className={cn("min-w-0 relative", className?.primitive)}
      {...props}
    >
      <ComboBox.Input
        prefix={
          withIcon && (
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Globe02Icon}
                size={14}
                data-slot="icon"
                className="shrink-0"
              />
              {selectedKey && (
                <p
                  className={cn(
                    "text-muted-fg text-sm whitespace-nowrap",
                    isFocused ? "hidden" : "flex h-full",
                  )}
                >
                  {itemsMap?.[selectedKey]?.displayoffset}
                </p>
              )}
            </div>
          )
        }
        className={{
          input: cn(className?.input),
          fieldGroup: className?.fieldGroup,
          icon: isOpen ? "rotate-180 text-fg" : "text-muted-fg",
        }}
        placeholder="Timezone"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
          }
        }}
      />

      <ComboBox.List
        isOpen={isOpen}
        className={cn("max-h-[300px]!", className?.overlay)}
        {...listProps}
        items={items}
      >
        {(item) => (
          <ComboBox.Option
            key={item.name}
            id={item.name}
            textValue={`${item.displayname}`}
            isDisabled={isDisabled}
          >
            <DropdownLabel>
              <span className="text-muted-fg tabular-nums shrink-0 mr-2">
                {item.displayoffset}
              </span>
              {item.displayname}
            </DropdownLabel>
          </ComboBox.Option>
        )}
      </ComboBox.List>
    </ComboBox>
  );
};
