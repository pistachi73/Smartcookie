import { tv } from "tailwind-variants";

const headingStyles = tv({
  base: "font-semibold font-sans text-fg tracking-tight",
  variants: {
    level: {
      1: "text-xl sm:text-2xl font-bold",
      2: "text-lg sm:text-xl font-semibold",
      3: "text-base sm:text-lg font-medium",
      4: "text-base font-medium",
    },
    tracking: {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
      wider: "tracking-wider",
      widest: "tracking-widest",
    },
  },
});
type HeadingType = { level?: 1 | 2 | 3 | 4 } & React.ComponentPropsWithoutRef<
  "h1" | "h2" | "h3" | "h4"
>;

interface HeadingProps extends HeadingType {
  tracking?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  className?: string | undefined;
}

const Heading = ({
  className,
  tracking = "normal",
  level = 1,
  ...props
}: HeadingProps) => {
  const Element: `h${typeof level}` = `h${level}`;
  return (
    <Element
      className={headingStyles({
        level,
        tracking,
        className,
      })}
      {...props}
    />
  );
};

export { Heading };
export type { HeadingProps };
