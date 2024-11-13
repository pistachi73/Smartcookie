import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UserAvatar } from "@/components/ui/user-avatar";
import { AbacusIcon } from "@hugeicons/react";

export default async function Components() {
  return (
    <div className="flex gap-3 h-full min-h-screen flex-col items-center justify-center bg-background h- px-">
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
