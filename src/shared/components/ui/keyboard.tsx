"use client";

import { Keyboard as KeyboardPrimitive } from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface KeyboardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
  keys: string | string[];
  className?: {
    base?: string;
    kbd?: string;
  };
}

const Keyboard = ({ keys, className, ...props }: KeyboardProps) => {
  return (
    <KeyboardPrimitive
      className={twMerge(
        "hidden font-mono text-current group-hover:text-fg group-focus:text-fg group-focus:opacity-90 group-disabled:opacity-50 lg:inline-flex forced-colors:group-focus:text-[HighlightText] forced-colors:group-focus:text-[HighlightText]",
        className?.base,
      )}
      {...props}
    >
      {(Array.isArray(keys) ? keys : keys.split("")).map((char, index) => (
        <kbd
          key={index}
          className={twMerge(
            "tracking-widest",
            index > 0 && char.length > 1 && "pl-1",
            className?.kbd,
          )}
        >
          {char}
        </kbd>
      ))}
    </KeyboardPrimitive>
  );
};

export { Keyboard };
export type { KeyboardProps };
