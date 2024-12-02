"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { EarthIcon } from "@hugeicons/react";
import { useState } from "react";
import type { Path, UseFormReturn } from "react-hook-form";
import { timezones } from "./timezones";
import { findTimezoneByName } from "./utils";

export const TimezoneSelect = <T extends { timezone: string }>({
  form,
}: {
  form: UseFormReturn<T>;
}) => {
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);

  console.log(
    Object.entries(timezones).map(([key, value]) => ({
      ...value,
    })),
  );

  const sortedtTimezones = timezones.sort((a, b) => {
    return a.offset - b.offset;
  });

  console.log({ sortedtTimezones });

  return (
    <FormField
      control={form.control}
      name={"timezone" as Path<T>}
      render={({ field }) => (
        <FormItem className="w-full">
          <Popover
            open={isTimezoneOpen}
            onOpenChange={(open) => {
              setIsTimezoneOpen(open);
            }}
          >
            <FormControl>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"sm"}
                  className={cn(
                    "w-full justify-between font-normal rounded-lg",
                    !field.value && "text-neutral-500",
                  )}
                >
                  {field.value ? (
                    findTimezoneByName(field.value)?.descriptiveName
                  ) : (
                    <span>Timezone</span>
                  )}
                  <EarthIcon size={16} />
                </Button>
              </PopoverTrigger>
            </FormControl>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-none">
              <Command className="w-full border-border border">
                <CommandInput
                  className="placeholder:text-sm"
                  placeholder="Search timezone..."
                />
                <CommandList>
                  <CommandEmpty>No timezone found.</CommandEmpty>
                  <CommandGroup>
                    {timezones.map(({ name, descriptiveName }) => (
                      <CommandItem
                        key={name}
                        value={name}
                        className="text-base"
                        onSelect={(currentValue) => {
                          field.onChange(
                            currentValue ===
                              form.getValues("timezone" as Path<T>)
                              ? ""
                              : currentValue,
                          );
                          setIsTimezoneOpen(false);
                        }}
                      >
                        <span className="tabular-nums">
                          {descriptiveName.split(")")[0]}
                          {")"}
                        </span>
                        {descriptiveName.split(")")[1]}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
