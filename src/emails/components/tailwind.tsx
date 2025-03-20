import { Tailwind as ReactEmailTailwind } from "@react-email/components";

export const Tailwind = ({ children }: { children: any }) => {
  return (
    <ReactEmailTailwind
      config={{
        theme: {
          fontFamily: {
            sans: [
              "-apple-system",
              "BlinkMacSystemFont",
              "Segoe UI",
              "Roboto",
              "Oxygen",
              "Ubuntu",
              "Cantarell",
              "Fira Sans",
              "Droid Sans",
              "Helvetica Neue",
              "sans-serif",
            ],
          },
        },
        separator: ":",
        safelist: [],
        experimental: {},
        corePlugins: {},
      }}
    >
      {children}
    </ReactEmailTailwind>
  );
};
