import {
  ComboBoxField,
  ComboBoxFieldContent,
  type ComboBoxFieldContentProps,
  type ComboBoxFieldProps,
} from "@/components/ui/react-aria/combobox";
import type { PgTimezone } from "@/data-access/pg";
import { cn } from "@/lib/utils";
import { Globe02Icon, Loading02Icon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { Button, Group, Input } from "react-aria-components";
import { ListBoxItem } from "../react-aria/list-box";
import { fieldWrapperVariants } from "../react-aria/shared-styles/field-variants";
import { getPgTimezonesAction } from "./actions";

type TimezoneSelectFieldProps<T extends object> = ComboBoxFieldProps<T> & {
  withIcon?: boolean;
};

const TimezoneSelectContext = createContext<{
  items: PgTimezone[] | undefined;
}>({
  items: undefined,
});

export const TimezoneSelectField = <T extends object>({
  className,
  isDisabled,
  selectedKey,
  children,
  ...props
}: TimezoneSelectFieldProps<T>) => {
  const { data: items, isLoading } = useQuery({
    queryKey: ["timezones"],
    queryFn: async () => {
      const res = await getPgTimezonesAction();
      return res?.data;
    },
    enabled: true,
  });

  return (
    <TimezoneSelectContext.Provider value={{ items }}>
      <ComboBoxField
        menuTrigger="focus"
        isDisabled={isDisabled || isLoading}
        selectedKey={selectedKey}
        {...props}
      >
        <Group
          className={cn(
            fieldWrapperVariants({ size: "sm" }),
            "flex flex-row items-center justify-between px-0 overflow-hidden pl-0 relative",
            className,
          )}
        >
          <Button
            className={cn(
              "absolute left-0 top-0 transition-colors h-full aspect-square flex items-center justify-center p-0 rounded-none ",
              !selectedKey && "text-text-sub",
              isLoading ? "cursor-not-allowed" : "cursor-pointer",
            )}
          >
            {isLoading ? (
              <Loading02Icon size={16} className="animate-spin" />
            ) : (
              <Globe02Icon size={16} color="var(--color-text-sub)" />
            )}
          </Button>
          <Input className={"flex-1 h-full pl-10"} placeholder="Timezone" />
        </Group>
        {children}
      </ComboBoxField>
    </TimezoneSelectContext.Provider>
  );
};

type TimezoneSelectContentProps<T extends object> = Omit<
  ComboBoxFieldContentProps<T>,
  "items" | "children"
>;

export const TimezoneSelectContent = <T extends object>({
  ...props
}: TimezoneSelectContentProps<T>) => {
  const { items } = useContext(TimezoneSelectContext);
  return (
    <ComboBoxFieldContent items={items} {...props}>
      {(item) => (
        <ListBoxItem showCheckIcon key={item.name} id={item.name}>
          {item.displayname}
        </ListBoxItem>
      )}
    </ComboBoxFieldContent>
  );
};
