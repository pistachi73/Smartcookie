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
    <div className="min-w-[300px]">
      <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            size={"sm"}
            className={cn(
              "w-full justify-between text-left font-normal rounded-none rounded-t-lg",
              !date && "text-text-sub",
            )}
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <Calendar03Icon size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 rounded-lg">
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
              size={"sm"}
              className={cn(
                "border-l border-y-0 border-r-0 w-full justify-between text-left font-normal bg-transparent rounded-none",
                "focus-visible:border",
                !startTime && "text-text-sub",
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
        <div className="size-10 p-1 flex items-center justify-center bg-neutral/20 rounded-sm shrink-0">
          <ArrowRight02Icon size={16} className="text-text-sub" />
        </div>
        <Select onValueChange={(value) => setEndTime(value)}>
          <SelectTrigger asChild>
            <Button
              variant={"outline"}
              size={"sm"}
              className={cn(
                "w-full justify-between text-left font-normal rounded-none bg-transparent border-r border-y-0 border-l-0",
                "focus-visible:border",
                !endTime && "text-text-sub",
              )}
            >
              {endTime ? endTime : <span>End</span>}
              <ArrowUpDownIcon size={16} />
            </Button>
          </SelectTrigger>
          <SelectContent className="p-0">
            {filteredEndTimeOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="tabular-nums">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Popover open={isTimezoneOpen} onOpenChange={setIsTimezoneOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            size={"sm"}
            className={cn(
              "w-full justify-between text-left font-normal rounded-none rounded-b-lg",
              !timezone && "text-text-sub",
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
