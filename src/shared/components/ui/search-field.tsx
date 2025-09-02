"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { CancelIcon, SearchIcon } from "@hugeicons-pro/core-stroke-rounded";
import type { SearchFieldProps as SearchFieldPrimitiveProps } from "react-aria-components";
import {
  Button,
  SearchField as SearchFieldPrimitive,
} from "react-aria-components";

import { composeTailwindRenderProps } from "@/shared/lib/primitive";

import {
  Description,
  FieldError,
  FieldGroup,
  type FieldProps,
  Input,
  Label,
} from "./field";
import { Loader } from "./loader";

interface SearchFieldProps
  extends Omit<SearchFieldPrimitiveProps, "className">,
    FieldProps {
  isPending?: boolean;
  ref?: React.RefObject<HTMLInputElement>;
  suffix?: React.ReactNode | string;
  className?: {
    primitive?: string;
    fieldGroup?: string;
    input?: string;
  };
}

const SearchField = ({
  ref,
  children,
  className,
  placeholder,
  label,
  description,
  errorMessage,
  isPending,
  suffix,
  ...props
}: SearchFieldProps) => {
  return (
    <SearchFieldPrimitive
      {...props}
      className={composeTailwindRenderProps(
        className?.primitive,
        "group/search-field relative flex flex-col gap-y-1 *:data-[slot=label]:font-medium",
      )}
    >
      {(values) => (
        <>
          {label && <Label>{label}</Label>}
          {typeof children === "function" ? (
            children(values)
          ) : children ? (
            children
          ) : (
            <FieldGroup className={className?.fieldGroup}>
              {isPending ? (
                <Loader variant="spin" />
              ) : (
                <HugeiconsIcon icon={SearchIcon} data-slot="icon" />
              )}
              <Input
                ref={ref}
                placeholder={placeholder ?? "Search..."}
                className={className?.input}
              />
              {suffix ? (
                typeof suffix === "string" ? (
                  <span className="mr-2 text-muted-fg">{suffix}</span>
                ) : (
                  suffix
                )
              ) : null}

              <Button className="grid place-content-center pressed:text-fg text-muted-fg hover:text-fg group-empty/search-field:invisible">
                <HugeiconsIcon icon={CancelIcon} data-slot="icon" />
              </Button>
            </FieldGroup>
          )}

          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>
        </>
      )}
    </SearchFieldPrimitive>
  );
};

export type { SearchFieldProps };
export { SearchField };
