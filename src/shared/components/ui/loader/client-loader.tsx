"use client";

import { ProgressBar } from "react-aria-components";
import { twMerge } from "tailwind-merge";

import { DEFAULT_SPINNER, LOADERS, type LoaderVariant } from "./primitives";
import { type LoaderVariantProps, loaderStyles } from "./shared/styles";

interface ClientLoaderProps
  extends Omit<
      React.ComponentPropsWithoutRef<"svg">,
      "display" | "opacity" | "intent"
    >,
    LoaderVariantProps {
  variant?: LoaderVariant;
  percentage?: number;
  isIndeterminate?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  ref?: React.RefObject<SVGSVGElement>;
}

// Client loader with React Aria (requires "use client")
const ClientLoader = ({
  isIndeterminate = true,
  ref,
  ...props
}: ClientLoaderProps) => {
  const {
    className,
    variant = DEFAULT_SPINNER,
    intent,
    size,
    ...spinnerProps
  } = props;
  const LoaderPrimitive =
    LOADERS[variant in LOADERS ? variant : DEFAULT_SPINNER];

  return (
    <ProgressBar
      data-slot="loader"
      aria-label={props["aria-label"] ?? "Loading..."}
      formatOptions={props.formatOptions}
      isIndeterminate={isIndeterminate}
    >
      <LoaderPrimitive
        role="presentation"
        className={loaderStyles({
          intent,
          size,
          className: twMerge([
            ["ring"].includes(variant) && "animate-spin",
            variant === "spin" && "stroke-current",
            className,
          ]),
        })}
        ref={ref}
        {...spinnerProps}
      />
    </ProgressBar>
  );
};

export { ClientLoader };
export type { ClientLoaderProps };
