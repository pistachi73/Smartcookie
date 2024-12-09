"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/react-aria/calendar";
import { DateInput } from "@/components/ui/react-aria/date-input";
import { ListBox, ListBoxItem } from "@/components/ui/react-aria/list-box";
import { Modal } from "@/components/ui/react-aria/modal";
import { Popover } from "@/components/ui/react-aria/popover";
import { Sheet } from "@/components/ui/react-aria/sheet";
import { TextField } from "@/components/ui/react-aria/text-field";
import { TimeField } from "@/components/ui/react-aria/time-field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UserAvatar } from "@/components/ui/user-avatar";
import { AbacusIcon } from "@hugeicons/react";
import {
  Dialog,
  DialogTrigger,
  Heading,
  Select,
  SelectValue,
} from "react-aria-components";
import { TestForm } from "./_component-tests/form";

export default function Components() {
  const items = [
    { id: "chocolate", textValue: "Chocolate" },
    { id: "mint", textValue: "Mint" },
    { id: "strawberry", textValue: "Strawberry" },
    { id: "1", textValue: "1" },
    { id: "2", textValue: "2" },
    { id: "3", textValue: "3" },
    { id: "4", textValue: "4" },
    { id: "5", textValue: "5" },
    { id: "6", textValue: "6" },
    { id: "7", textValue: "7" },
    { id: "8", textValue: "8" },
    { id: "9", textValue: "9" },
    { id: "10", textValue: "10" },
    { id: "11", textValue: "11" },
    { id: "12", textValue: "12" },
    { id: "13", textValue: "13" },
    { id: "14", textValue: "14" },
    { id: "15", textValue: "15" },
  ];

  return (
    <div className="flex gap-3 h-full min-h-screen flex-col items-center justify-center bg-background py-12">
      <DateInput />
      <TestForm />
      <TimeField size="sm" hourCycle={24} />
      <TextField placeholder="Enter your name" size="sm" />

      <Calendar />
      <Select placeholder="Select an option">
        <Button variant={"outline"}>
          <SelectValue className={"data-[placeholder]:text-neutral-500"} />
        </Button>
        <Popover className="w-[--trigger-width] h-[300px]" placement="bottom">
          <ListBox items={items}>
            {(item) => (
              <ListBoxItem showCheckIcon key={item.id} id={item.id}>
                {item.textValue}
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </Select>
      <ListBox
        aria-label="Ice cream flavor"
        selectionMode="single"
        className={"p-2 border rounded-lg space-y-0.5"}
      >
        {items.map((item) => (
          <ListBoxItem key={item.id} id={item.id}>
            {item.textValue}
          </ListBoxItem>
        ))}
      </ListBox>
      <DialogTrigger>
        <Button variant={"ghost"}>Popover</Button>
        <Popover placement="right">
          <Dialog>
            <Heading slot="title">Help</Heading>
            <p>For help accessing your account, please contact support.</p>
          </Dialog>
        </Popover>
      </DialogTrigger>
      <DialogTrigger>
        <Button>Open sheet</Button>
        <Sheet isDismissable side="right">
          <Dialog className="h-auto w-[500px]">
            <Heading slot="title">Notice</Heading>
            <p>Click outside to close this dialog.</p>
            <p>Click outside to close this dialog.</p>
          </Dialog>
        </Sheet>
      </DialogTrigger>
      <DialogTrigger>
        <Button>Open dialog</Button>
        <Modal isDismissable>
          <Dialog>
            <Heading slot="title">Notice</Heading>
            <p>Click outside to close this dialog.</p>
          </Dialog>
        </Modal>
      </DialogTrigger>
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">Day</ToggleGroupItem>
        <ToggleGroupItem value="b">Week</ToggleGroupItem>
        <ToggleGroupItem value="c">Month</ToggleGroupItem>
      </ToggleGroup>
      <Accordion type="single" className="w-[300px]" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-row gap-2 items-center">
        <Button variant="primary" size="lg">
          Button
        </Button>
        <Button variant="primary" className="bg-primary" iconOnly={true}>
          <AbacusIcon size={18} />
        </Button>
        <Button variant="primary" size="sm">
          Button
        </Button>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Button variant="secondary" size="lg">
          Button
        </Button>
        <Button variant="secondary">
          <AbacusIcon size={18} />
          Button
        </Button>
        <Button variant="secondary" size="sm">
          Button
        </Button>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Button variant="tertiary" size="lg">
          Button
        </Button>
        <Button variant="tertiary">
          <AbacusIcon size={18} />
          Button
        </Button>
        <Button variant="tertiary" size="sm">
          Button
        </Button>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Button variant="outline" size="lg">
          Button
        </Button>
        <Button variant="outline">
          <AbacusIcon size={18} />
          Button
        </Button>
        <Button variant="outline" size="sm">
          Button
        </Button>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Button variant="ghost" size="lg">
          Button
        </Button>
        <Button variant="ghost">
          <AbacusIcon size={18} />
          Button
        </Button>
        <Button variant="ghost" size="sm">
          Button
        </Button>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <UserAvatar
          userImage={"https://i.pravatar.cc/150?img=1"}
          userName={"Oscar Pulido"}
          size="lg"
        />
        <UserAvatar userName={"Oscar Pulido"} />
        <UserAvatar size={"sm"} />
      </div>
    </div>
  );
}
