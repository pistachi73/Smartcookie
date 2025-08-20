"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
  MoreHorizontalIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import type {
  ListBoxItemProps,
  ListBoxProps,
  ListBoxSectionProps,
} from "react-aria-components";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Separator,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

import { buttonStyles } from "./button";
import { composeTailwindRenderProps } from "./primitive";

type PaginationProps = React.ComponentProps<"nav">;
const Pagination = ({ className, ref, ...props }: PaginationProps) => (
  <nav
    aria-label="pagination"
    ref={ref}
    className={twMerge(
      "mx-auto flex w-full justify-center gap-[5px]",
      className,
    )}
    {...props}
  />
);

interface PaginationSectionProps<T> extends ListBoxSectionProps<T> {
  ref?: React.RefObject<HTMLElement>;
}
const PaginationSection = <T extends object>({
  className,
  ref,
  ...props
}: PaginationSectionProps<T>) => (
  <ListBoxSection
    ref={ref}
    {...props}
    className={twMerge("flex h-9 gap-[5px]", className)}
  />
);

interface PaginationListProps<T> extends ListBoxProps<T> {
  ref?: React.RefObject<HTMLDivElement>;
}
const PaginationList = <T extends object>({
  className,
  ref,
  ...props
}: PaginationListProps<T>) => {
  return (
    <ListBox
      ref={ref}
      orientation="horizontal"
      aria-label={props["aria-label"] || "Pagination"}
      layout="grid"
      className={composeTailwindRenderProps(
        className,
        "flex flex-row items-center gap-[5px]",
      )}
      {...props}
    />
  );
};

const renderListItem = (
  props: ListBoxItemProps & {
    textValue?: string;
    "aria-current"?: string | undefined;
    isDisabled?: boolean;
    className?: string;
  },
  children: React.ReactNode,
) => <ListBoxItem {...props}>{children}</ListBoxItem>;

interface PaginationItemProps extends ListBoxItemProps {
  children?: React.ReactNode;
  className?: string;
  intent?: "primary" | "secondary" | "outline" | "plain";
  size?: "md" | "xs" | "sq-xs" | "sm" | "lg" | "sq-sm" | "sq-md" | "sq-lg";
  shape?: "square" | "circle";
  isCurrent?: boolean;
  segment?:
    | "label"
    | "separator"
    | "ellipsis"
    | "default"
    | "last"
    | "first"
    | "previous"
    | "next";
}

const PaginationItem = ({
  segment = "default",
  size = "sq-sm",
  intent = "outline",
  className,
  isCurrent,
  children,
  isDisabled,
  ...props
}: PaginationItemProps) => {
  const textValue =
    typeof children === "string"
      ? children
      : typeof children === "number"
        ? children.toString()
        : undefined;

  const renderPaginationIndicator = (indicator: React.ReactNode) =>
    renderListItem(
      {
        textValue: segment,
        "aria-current": isCurrent ? "page" : undefined,
        isDisabled: isCurrent || isDisabled,
        className: buttonStyles({
          intent: "outline",
          size: "sq-sm",
          isDisabled: isCurrent || isDisabled,
          className: twMerge(
            "cursor-pointer font-normal text-fg focus-visible:border-primary focus-visible:bg-primary/10 focus-visible:ring-4 focus-visible:ring-primary/20",
            className,
          ),
        }),
        ...props,
      },
      indicator,
    );

  switch (segment) {
    case "label":
      return renderListItem(
        {
          textValue: textValue,
          className: twMerge(
            "grid h-9 place-content-center px-3.5 tabular-nums",
            className,
          ),
          ...props,
        },
        children,
      );
    case "separator":
      return renderListItem(
        {
          textValue: "Separator",
          className: twMerge("grid h-9 place-content-center", className),
          ...props,
        },
        <Separator
          orientation="vertical"
          className="h-5 w-[1.5px] shrink-0 rotate-14 bg-secondary-fg/40"
        />,
      );
    case "ellipsis":
      return renderListItem(
        {
          textValue: "More pages",
          className: twMerge(
            "flex size-9 items-center justify-center rounded-lg border border-transparent focus:outline-hidden focus-visible:border-primary focus-visible:bg-primary/10 focus-visible:ring-4 focus-visible:ring-primary/20",
            className,
          ),
          ...props,
        },
        <span
          aria-hidden
          className={twMerge(
            "flex size-9 items-center justify-center",
            className,
          )}
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
        </span>,
      );
    case "previous":
      return renderPaginationIndicator(
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />,
      );
    case "next":
      return renderPaginationIndicator(
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />,
      );
    case "first":
      return renderPaginationIndicator(
        <HugeiconsIcon icon={ArrowLeftDoubleIcon} size={16} />,
      );
    case "last":
      return renderPaginationIndicator(
        <HugeiconsIcon icon={ArrowRightDoubleIcon} size={16} />,
      );
    default:
      return renderListItem(
        {
          textValue: textValue,
          "aria-current": isCurrent ? "page" : undefined,
          isDisabled: isCurrent,
          className: buttonStyles({
            intent: isCurrent ? "primary" : intent,
            size,
            className: twMerge(
              "cursor-pointer font-normal tabular-nums disabled:cursor-default disabled:opacity-100 focus-visible:border-primary focus-visible:bg-primary/10 focus-visible:ring-4 focus-visible:ring-primary/20",
              className,
            ),
          }),
          ...props,
        },
        children,
      );
  }
};

Pagination.Item = PaginationItem;
Pagination.List = PaginationList;
Pagination.Section = PaginationSection;

export { Pagination };
export type {
  PaginationItemProps,
  PaginationListProps,
  PaginationProps,
  PaginationSectionProps,
};
