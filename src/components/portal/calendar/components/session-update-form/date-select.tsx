"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Calendar03Icon } from "@hugeicons/react";
import { format } from "date-fns";
import { useState } from "react";
import type { SesionUpdateForm } from ".";

type DateSelectProps = {
  form: ;
};

export const DateSelect = ({ form }: DateSelectProps) => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem>
          <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
            <FormControl>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  size={"sm"}
                  className={cn(
                    "w-full justify-between text-left font-normal rounded-lg",
                    !field.value && "text-neutral-500",
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <Calendar03Icon size={16} />
                </Button>
              </PopoverTrigger>
            </FormControl>
            <PopoverContent className="w-auto p-0 rounded-lg">
              <Calendar
                mode="single"
                selected={new Date(field.value)}
                onSelect={(date) => {
                  field.onChange(date);
                  setIsDateOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
