"use client";
import { cn } from "@/lib/utils";

import {
  ArrowRight02Icon,
  ArrowUpDownIcon,
  Calendar03Icon,
  EarthIcon,
} from "@hugeicons/react";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "../button";
import { Calendar } from "../calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";
import { Separator } from "../separator";
import { type TimezoneName, timezones } from "./constants";

const timeSelectOptions = Array.from({ length: 24 * 4 }, (_, index) => {
  const hours = Math.floor(index / 4);
  const minutes = (index % 4) * 15;
  const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  return { value: time, label: time };
});

const formatTimezoneName = (timezone: string, utcOffset: string) =>
  `${utcOffset} ${timezone.replace("_", " ").replace("/", " - ")}`;

export const DateTimePicker = () => {
  const [date, setDate] = useState<Date>();
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [startTime, setStartTime] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();
  const [timezone, setTimezone] = useState<string | undefined>();
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);

  const filteredEndTimeOptions = timeSelectOptions.filter(({ value }) => {
    return startTime ? value > startTime : true;
  });

  return (
    <div className="rounded-xl border border-border min-w-[300px] overflow-hidden">
      <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-between text-left font-normal rounded-none border-none",
              !date && "text-neutral-500",
            )}
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <Calendar03Icon size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              setIsDateOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <Separator decorative />
      <div className="flex items-center gap-1">
        <Select
          onValueChange={(value) => {
            setStartTime(value);
            if (endTime && value >= endTime) {
              setEndTime(undefined);
            }
          }}
        >
          <SelectTrigger asChild>
            <Button
              variant={"outline"}
              size={"default"}
              className={cn(
                "w-full justify-between text-left font-normal rounded-none border-none",
                !startTime && "text-neutral-500",
              )}
            >
              {startTime ? startTime : <span>Start</span>}
              <ArrowUpDownIcon size={16} />
            </Button>
          </SelectTrigger>
          <SelectContent className="w-auto p-0">
            {timeSelectOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="tabular-nums">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="size-6 p-1 flex items-center justify-center bg-neutral/20 rounded-sm shrink-0">
          <ArrowRight02Icon size={16} className="text-neutral-500" />
        </div>
        <Select onValueChange={(value) => setEndTime(value)}>
          <SelectTrigger asChild>
            <Button
              variant={"outline"}
              size={"default"}
              className={cn(
                "w-full justify-between text-left font-normal rounded-none border-none",
                !endTime && "text-neutral-500",
              )}
            >
              {endTime ? endTime : <span>End</span>}
              <ArrowUpDownIcon size={16} />
            </Button>
          </SelectTrigger>
          <SelectContent className="w-auto p-0">
            {filteredEndTimeOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="tabular-nums">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <Popover open={isTimezoneOpen} onOpenChange={setIsTimezoneOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            size={"default"}
            className={cn(
              "border-none w-full justify-between text-left font-normal rounded-none",
              !timezone && "text-neutral-500",
            )}
          >
            {timezone
              ? formatTimezoneName(
                  timezone,
                  timezones[timezone as TimezoneName].utcOffset,
                )
              : "Timezone"}
            <EarthIcon size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-none">
          <Command className="w-full border-border border">
            <CommandInput
              className="placeholder:text-sm"
              placeholder="Search timezone..."
            />
            <CommandList>
              <CommandEmpty>No timezone found.</CommandEmpty>
              <CommandGroup>
                {Object.entries(timezones).map(([name, { utcOffset }]) => (
                  <CommandItem
                    key={name}
                    value={name}
                    className="text-base"
                    onSelect={(currentValue) => {
                      setTimezone(
                        currentValue === timezone ? "" : currentValue,
                      );
                      setIsTimezoneOpen(false);
                    }}
                  >
                    {formatTimezoneName(name, utcOffset)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
