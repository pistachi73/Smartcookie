"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUp01Icon,
  Linkedin01Icon,
  SmartPhoneIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import Image from "next/image";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/classes";

import { Heading } from "../ui/heading";
import { Link } from "../ui/link";
import { MaxWidthWrapper } from "./max-width-wrapper";

const navigationLinks = [
  { label: "Features", href: "#features" },
  { label: "Highlights", href: "#main-points" },
  { label: "Pricing", href: "#pricing" },
  { label: "About us", href: "#about" },
];

const socialLinks = [
  {
    name: "Martina Monreal",
    description: "CEO & Co-Founder",
    href: "https://www.linkedin.com/in/martinamonreal-smartcookie/",
    icon: Linkedin01Icon,
  },
  {
    name: "Óscar Pulido",
    description: "CTO & Co-Founder",
    href: "https://www.linkedin.com/in/oscar-pulido-castillo/",
    icon: Linkedin01Icon,
  },
  {
    name: "Phone",
    description: "+34 611 15 15 27",
    href: "tel:+34611151527",
    icon: SmartPhoneIcon,
  },
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const Footer = () => {
  return (
    <footer className="p-[2%] md:p-6">
      <div className="bg-muted rounded-2xl p-6">
        <MaxWidthWrapper className="py-8 lg:py-12">
          <div className="space-y-12">
            <Heading
              level={2}
              tracking="tight"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary-shade to-primary bg-clip-text text-transparent text-center"
            >
              Teach smarter with SmartCookie
            </Heading>

            {/* Navigation and social section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Logo and description */}
              <div className="space-y-6 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <Image
                    src="/Logo.svg"
                    alt="SmartCookie Logo"
                    height={28}
                    width={14}
                    className="shrink-0"
                  />
                  <span className="text-xl font-bold text-primary">
                    SmartCookie
                  </span>
                </div>
                <p className="text-sm text-muted-fg leading-relaxed max-w-sm">
                  SmartCookie is the all-in-one app that acts as a second brain
                  for language teachers, helping them organize their calendars,
                  track lesson progress, and boost student motivation through
                  actionable feedback.
                </p>
              </div>

              {/* Navigation links */}
              <div className="space-y-6 lg:col-span-1">
                <Heading
                  level={3}
                  className="uppercase text-sm sm:text-sm font-semibold"
                >
                  Navigation
                </Heading>
                <nav className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      intent="primary"
                      className="text-sm text-muted-fg"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Social links */}
              <div className="space-y-6 lg:col-span-1">
                <Heading
                  level={3}
                  className="uppercase text-sm sm:text-sm font-semibold"
                >
                  Connect
                </Heading>
                <div className="space-y-3">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      target={
                        social.href.startsWith("http") ? "_blank" : "_self"
                      }
                      rel={
                        social.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className={cn(
                        "w-full text-left justify-start",
                        "flex items-center gap-2",
                      )}
                    >
                      <HugeiconsIcon icon={social.icon} size={16} />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm">
                          {social.name}
                        </span>
                        <span className="text-xs text-muted-fg/80">
                          {social.description}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="pt-8 border-t border-border/40">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <p>
                  © {new Date().getFullYear()} SmartCookie. All rights reserved.
                </p>
                <Button
                  onPress={scrollToTop}
                  intent="secondary"
                  size="small"
                  className={cn(
                    "group flex items-center gap-2 px-4 py-2",
                    "hover:bg-primary-tint hover:text-primary transition-all duration-200",
                    "border-border/40 hover:border-primary/30",
                  )}
                >
                  <HugeiconsIcon
                    icon={ArrowUp01Icon}
                    size={16}
                    className="group-hover:-translate-y-0.5 transition-transform duration-200"
                  />
                  Back to top
                </Button>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </footer>
  );
};
