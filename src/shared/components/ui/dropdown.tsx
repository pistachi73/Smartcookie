"use client";

import { cn } from "@/shared/lib/classes";
import { Tick02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Collection,
  Header,
  ListBoxItem as ListBoxItemPrimitive,
  type ListBoxItemProps,
  ListBoxSection,
  type SectionProps,
  Separator,
  type SeparatorProps,
  Text,
  type TextProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Keyboard } from "./keyboard";

const dropdownItemStyles = tv({
  base: [
    "col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] not-has-data-[slot=dropdown-item-details]:items-center has-data-[slot=dropdown-item-details]:**:data-[slot=checked-icon]:mt-[1.5px] supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
    "group relative cursor-default select-none rounded-[calc(var(--radius-lg)-1px)] px-[calc(var(--spacing)*2.3)] py-1.5 forced-color:text-[Highlight] text-base text-fg outline-0 forced-color-adjust-none sm:text-sm/6 forced-colors:text-[LinkText]",
    "[&>[slot=label]+[data-slot=icon]]:absolute [&>[slot=label]+[data-slot=icon]]:right-0",
  ],
  variants: {
    isDisabled: {
      true: "text-muted-fg forced-colors:text-[GrayText]",
    },
    isSelected: {
      true: "bg-primary/30 text-primary-fg",
    },
    isFocused: {
      false: "data-danger:text-danger",
      true: [
        "bg-accent text-accent-fg forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
        "data-danger:bg-danger data-danger:text-danger-fg",
        "data-[slot=description]:text-accent-fg data-[slot=label]:text-accent-fg [&_.text-muted-fg]:text-accent-fg/80",
      ],
    },
  },
});

const dropdownSectionStyles = tv({
  slots: {
    section: "col-span-full grid grid-cols-[auto_1fr]",
    header:
      "col-span-full px-2.5 py-1 font-medium text-muted-fg text-sm sm:text-xs",
  },
});

const { section, header } = dropdownSectionStyles();

interface DropdownSectionProps<T> extends SectionProps<T> {
  title?: string;
}

const DropdownSection = <T extends object>({
  className,
  ...props
}: DropdownSectionProps<T>) => {
  return (
    <ListBoxSection className={section({ className })}>
      {"title" in props && <Header className={header()}>{props.title}</Header>}
      <Collection items={props.items}>{props.children}</Collection>
    </ListBoxSection>
  );
};

type DropdownItemProps = ListBoxItemProps & {
  showTick?: boolean;
};

const DropdownItem = ({
  className,
  showTick = true,
  ...props
}: DropdownItemProps) => {
  const textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <ListBoxItemPrimitive
      textValue={textValue}
      className={composeRenderProps(className, (className, renderProps) =>
        dropdownItemStyles({ ...renderProps, className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          {showTick && isSelected && (
            <HugeiconsIcon
              icon={Tick02Icon}
              data-slot="checked-icon"
              className="-mx-0.5 mr-2"
            />
          )}
          {typeof children === "string" ? (
            <DropdownLabel>{children}</DropdownLabel>
          ) : (
            children
          )}
        </>
      ))}
    </ListBoxItemPrimitive>
  );
};

interface DropdownItemDetailProps extends TextProps {
  label?: TextProps["children"];
  description?: TextProps["children"];
  classNames?: {
    label?: TextProps["className"];
    description?: TextProps["className"];
  };
}

const DropdownItemDetails = ({
  label,
  description,
  classNames,
  ...props
}: DropdownItemDetailProps) => {
  const { slot, children, title, ...restProps } = props;

  return (
    <div
      data-slot="dropdown-item-details"
      className="col-start-2 flex flex-col gap-y-1"
      {...restProps}
    >
      {label && (
        <Text
          slot={slot ?? "label"}
          className={cn("font-medium sm:text-sm", classNames?.label)}
          {...restProps}
        >
          {label}
        </Text>
      )}
      {description && (
        <Text
          slot={slot ?? "description"}
          className={cn("text-muted-fg text-xs", classNames?.description)}
          {...restProps}
        >
          {description}
        </Text>
      )}
      {!title && children}
    </div>
  );
};

interface MenuLabelProps extends TextProps {
  ref?: React.Ref<HTMLDivElement>;
}

const DropdownLabel = ({ className, ref, ...props }: MenuLabelProps) => (
  <Text
    slot="label"
    ref={ref}
    className={cn("col-start-2", className)}
    {...props}
  />
);

const DropdownSeparator = ({ className, ...props }: SeparatorProps) => (
  <Separator
    orientation="horizontal"
    className={cn("-mx-1 col-span-full my-1 h-px bg-border", className)}
    {...props}
  />
);

const DropdownKeyboard = ({
  className,
  ...props
}: React.ComponentProps<typeof Keyboard>) => {
  return (
    <Keyboard className={cn("absolute right-2 pl-2", className)} {...props} />
  );
};

/**
 * Note: This is not exposed component, but it's used in other components to render dropdowns.
 * @internal
 */
export {
  DropdownItem,
  DropdownItemDetails,
  DropdownKeyboard,
  DropdownLabel,
  DropdownSection,
  DropdownSeparator,
  dropdownItemStyles,
  dropdownSectionStyles,
};
export type {
  DropdownItemDetailProps,
  DropdownItemProps,
  DropdownSectionProps,
};
