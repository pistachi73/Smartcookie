import {
  ComboBoxField,
  ComboBoxFieldContent,
  type ComboBoxFieldContentProps,
  type ComboBoxFieldProps,
} from "@/components/ui/react-aria/combobox";
import type { PgTimezone } from "@/data-access/pg";
import { cn } from "@/lib/utils";
import { Globe02Icon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo, useState } from "react";
import { Button, Group, Input } from "react-aria-components";
import { ListBoxItem } from "../react-aria/list-box";
import { fieldWrapperVariants } from "../react-aria/shared-styles/field-variants";
import { getPgTimezonesAction } from "./actions";

type TimezoneComboboxProps<T extends object> = ComboBoxFieldProps<T> & {
  withIcon?: boolean;
};

const TimezoneComboboxxt = createContext<{
  items: PgTimezone[] | undefined;
}>({
  items: undefined,
});

export const TimezoneCombobox = <T extends object>({
  className,
  isDisabled,
  selectedKey,
  children,
  ...props
}: TimezoneComboboxProps<T>) => {
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
    <TimezoneComboboxxt.Provider value={{ items }}>
      <ComboBoxField
        menuTrigger="focus"
        isDisabled={isDisabled || isLoading}
        selectedKey={selectedKey}
        onFocusChange={setIsFocused}
        {...props}
      >
        <Group
          className={cn(
            fieldWrapperVariants({ size: "sm" }),
            "flex flex-row items-center justify-between px-0 overflow-hidden pl-0 relative",
            "[[data-focus-within=true]>span]:text-3xl",
            className,
          )}
        >
          <Button
            className={cn(
              "absolute top-0 left-0",
              "h-full aspect-square p-0 rounded-none",
              "flex items-center justify-center",
              isLoading ? "cursor-not-allowed" : "cursor-pointer",
            )}
          >
            <Globe02Icon size={16} color="var(--color-text-sub)" />
          </Button>
          {selectedKey && (
            <p
              className={cn(
                "items-center justify-center absolute left-0  pl-10  text-text-sub text-sm tabular-nums",
                isFocused ? "hidden" : "flex h-full",
              )}
            >
              {itemsMap?.[selectedKey]?.displayoffset}
            </p>
          )}
          <Input
            className={cn(
              "relative z-10 flex-1 h-full truncate pr-2",
              selectedKey ? "data-[focused]:pl-10 pl-30 " : "pl-10",
            )}
            placeholder="Timezone"
          />
        </Group>
        {children}
      </ComboBoxField>
    </TimezoneComboboxxt.Provider>
  );
};

type TimezoneComboboxContentProps<T extends object> = Omit<
  ComboBoxFieldContentProps<T>,
  "items" | "children"
>;

export const TimezoneComboboxContent = <T extends object>({
  ...props
}: TimezoneComboboxContentProps<T>) => {
  const { items } = useContext(TimezoneComboboxxt);
  return (
    <ComboBoxFieldContent items={items} {...props}>
      {(item) => (
        <ListBoxItem
          showCheckIcon
          key={item.name}
          id={item.name}
          textValue={`${item.displayname}`}
        >
          <span className="text-text-sub tabular-nums shrink-0">
            {item.displayoffset}
          </span>
          {item.displayname}
        </ListBoxItem>
      )}
    </ComboBoxFieldContent>
  );
};
