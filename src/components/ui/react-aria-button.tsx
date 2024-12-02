import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import React, { type ElementType } from "react";
import { type AriaButtonOptions, useButton } from "react-aria";
import { cn } from "../../lib/utils";
import { Button } from "./button";

type ReactAriaButtonProps = {
  ariaButtonOptions: AriaButtonOptions<ElementType>;
  buttonVariantsProps: VariantProps<typeof buttonVariants>;
  className?: string;
  children?: React.ReactNode;
};

export const ReactAriaButton = ({
  children,
  className,
  ariaButtonOptions,
  buttonVariantsProps,
}: ReactAriaButtonProps) => {
  const ref = React.useRef(null);
  const { buttonProps } = useButton(ariaButtonOptions, ref);
  console.log({ ariaButtonOptions });
  console.log({ buttonProps });
  return (
    <Button
      {...buttonProps}
      className={cn(buttonVariants(buttonVariantsProps), className)}
      ref={ref}
    >
      {children}
    </Button>
  );
};
