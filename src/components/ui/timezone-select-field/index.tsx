import {
  ComboBoxField,
  ComboBoxFieldContent,
  type ComboBoxFieldProps,
} from "@/components/ui/react-aria/combobox";
import { cn } from "@/lib/utils";
import { EarthIcon, Loading02Icon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Group, Input } from "react-aria-components";
import { ListBoxItem } from "../react-aria/list-box";
import { fieldWrapperVariants } from "../react-aria/shared-styles/field-variants";
import { getPgTimezonesAction } from "./actions";

type TimezoneSelectFieldProps<T extends object> = Omit<
  ComboBoxFieldProps<T>,
  "children"
>;

export const TimezoneSelectField = <T extends object>({
  className,
  isDisabled,
  selectedKey,
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
    <ComboBoxField
      menuTrigger="focus"
      isDisabled={isDisabled || isLoading}
      selectedKey={selectedKey}
      {...props}
    >
      <Group
        className={cn(
          fieldWrapperVariants({ size: "sm" }),
          "flex flex-row items-center justify-between px-0 gap-4 overflow-hidden",
        )}
      >
        <Input className={"flex-1 h-full pl-3"} />
        <Button
          className={cn(
            "transition-colors h-full aspect-square flex items-center justify-center p-0 rounded-none hover:bg-neutral-500/30",
            !selectedKey && "text-text-sub",
          )}
        >
          {isLoading ? (
            <Loading02Icon size={16} className="animate-spin" />
          ) : (
            <EarthIcon size={16} />
          )}
        </Button>
      </Group>
      <ComboBoxFieldContent
        items={items}
        offset={8}
        className={"w-[var(--trigger-width)]"}
      >
        {(item) => (
          <ListBoxItem showCheckIcon key={item.name} id={item.name}>
            {item.displayname}
          </ListBoxItem>
        )}
      </ComboBoxFieldContent>
    </ComboBoxField>
  );
};
