import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      colors: {
        neutral: {
          "300": "rgb(var(--neutral-300))",
          "500": {
            "20": "rgba(var(--neutral-500/20), 0.2)",
            "30": "rgba(var(--neutral-500/30), 0.3)",
            DEFAULT: "rgb(var(--neutral-500))",
          },
          "700": "rgb(var(--neutral-700))",
          DEFAULT: "rgb(var(--neutral-500))",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          50: "rgb(var(--primary-50))",
          100: "rgb(var(--primary-100))",
          200: "rgb(var(--primary-200))",
          300: "rgb(var(--primary-300))",
          400: "rgb(var(--primary-400))",
          500: "rgb(var(--primary-500))",
          600: "rgb(var(--primary-600))",
          700: "rgb(var(--primary-700))",
          800: "rgb(var(--primary-800))",
          900: "rgb(var(--primary-900))",
        },
        dark: "rgb(var(--dark))",
        light: {
          "15": "rgba(var(--light-15), .15)",
          "30": "rgba(var(--light-30), .3)",
          "70": "rgba(var(--light-70), .7)",
          "85": "rgba(var(--light-85), .85)",
          DEFAULT: "rgb(var(--light))",
        },
        background: {
          DEFAULT: "rgb(var(--background))",
          reverse: "rgb(var(--background-reverse))",
        },
        // border: "rgba(var(--border))",
        text: "rgb(var(--text))",
        "card-background": "rgba(var(--card-background))",
        "responsive-light": "rgb(var(--responsive-light))",
        "responsive-dark": "rgb(var(--responsive-dark))",
        ring: "rgb(var(--ring))",

        input: "hsl(var(--input))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "form-message-div-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-5px)",
            "max-height": "0px",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
            "max-height": "25px",
          },
        },
        "form-message-p-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-5px)",
            "max-height": "0rem",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
            "max-height": "25px",
          },
        },
        "password-input-div-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-5px)",
            "max-height": "0px",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
            "max-height": "100px",
          },
        },
        "password-input-p-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-5px)",
            "max-height": "0px",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
            "max-height": "100px",
          },
        },
      },
      // animation: {
      //   "accordion-down": "accordion-down 0.2s ease-out",
      //   "accordion-up": "accordion-up 0.2s ease-out",
      //   "form-message-div-down":
      //     "form-message-div-down 250ms ease-out 0s 1 normal none running",
      //   "form-message-p-down":
      //     "form-message-p-down 200ms ease 200ms 1 normal none running",
      //   "password-input-div-down":
      //     "password-input-div-down 250ms ease-out 0s 1 normal none running",
      //   "password-input-p-down":
      //     "password-input-p-down 200ms ease 200ms 1 normal none running",
      // },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
