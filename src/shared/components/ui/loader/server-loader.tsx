import { twMerge } from "tailwind-merge";

import { DEFAULT_SPINNER, LOADERS, type LoaderVariant } from "./primitives";
import { type LoaderVariantProps, loaderStyles } from "./shared/styles";

interface ServerLoaderProps
  extends Omit<
      React.ComponentPropsWithoutRef<"svg">,
      "display" | "opacity" | "intent"
    >,
    LoaderVariantProps {
  variant?: LoaderVariant;
  ref?: React.RefObject<SVGSVGElement>;
}

// Server-compatible loader (no React Aria dependencies)
const ServerLoader = ({ ref, ...props }: ServerLoaderProps) => {
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
    <LoaderPrimitive
      role="presentation"
      aria-label={props["aria-label"] ?? "Loading..."}
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
  );
};

export { ServerLoader };
export type { ServerLoaderProps };
