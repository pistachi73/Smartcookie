"use client";

import { Keyboard as KeyboardPrimitive } from "react-aria-components";
import { tv } from "tailwind-variants";

const keyboardStyles = tv({
  slots: {
    base: "hidden text-current/70 group-data-focused:text-fg group-data-hovered:text-fg group-data-disabled:opacity-50 group-data-focused:opacity-90 lg:inline-flex lg:inline-flex forced-colors:group-data-focused:text-[HighlightText]",
    kbd: "flex min-w-[2ch] text-xs rounded text-center font-sans text-xs px-1 py-0.5",
  },
});

const { base, kbd } = keyboardStyles();

interface KeyboardProps extends React.HTMLAttributes<HTMLElement> {
  keys: string | string[];
  classNames?: {
    base?: string;
    kbd?: string;
  };
}

const Keyboard = ({ keys, classNames, className, ...props }: KeyboardProps) => {
  return (
    <KeyboardPrimitive
      className={base({ className: classNames?.base ?? className })}
      {...props}
    >
      <kbd
        className={kbd({
          className: classNames?.kbd,
        })}
      >
        {Array.isArray(keys) ? keys.join("+") : keys}
      </kbd>
    </KeyboardPrimitive>
  );
};

export { Keyboard };
export type { KeyboardProps };
