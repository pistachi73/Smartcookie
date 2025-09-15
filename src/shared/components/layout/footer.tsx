"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Linkedin01Icon,
  SmartPhoneIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "react-aria-components";

import { cn } from "@/shared/lib/classes";

import { Heading } from "../ui/heading";
import { Link, linkStyles } from "../ui/link";
import { LocaleSwitcherSelect } from "../ui/locale-switcher/locale-switcher";
import { useHandleNavigation } from "./header";
import { MaxWidthWrapper } from "./max-width-wrapper";

const socialLinks = [
  {
    id: "martina-linkedin",
    name: "Martina Monreal",
    description: "CEO & Co-Founder",
    href: "https://www.linkedin.com/in/martinamonreal-smartcookie/",
    icon: Linkedin01Icon,
  },
  {
    id: "oscar-linkedin",
    name: "Óscar Pulido",
    description: "CTO & Co-Founder",
    href: "https://www.linkedin.com/in/oscar-pulido-castillo/",
    icon: Linkedin01Icon,
  },
  {
    id: "phone",
    description: "+34 611 15 15 27",
    href: "tel:+34611151527",
    icon: SmartPhoneIcon,
  },
];

export const Footer = () => {
  const tFooter = useTranslations("Landing.Footer");
  const tNavigation = useTranslations("Landing.Navigation");
  const tLegal = useTranslations("Landing.Legal");
  const handleNavigation = useHandleNavigation();
  const navigationLinks = [
    { id: "features", label: tNavigation("features"), href: "/#features" },
    {
      id: "highlights",
      label: tNavigation("highlights"),
      href: "/#highlights",
    },
    { id: "pricing", label: tNavigation("pricing"), href: "/#pricing" },
    { id: "about", label: tNavigation("about"), href: "/#about" },
  ];
  return (
    <footer className="p-[2%] md:p-6 bg-white">
      <div className="bg-muted rounded-2xl p-6">
        <MaxWidthWrapper className="py-8 lg:py-12">
          <div className="space-y-12">
            <Heading
              level={2}
              tracking="tight"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-linear-to-r from-primary via-primary-shade to-primary bg-clip-text text-transparent text-center"
            >
              {tFooter("title")}
            </Heading>
            {/* Navigation and social section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Logo and description */}
              <div className="space-y-6 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logos/smartcookie_logo.svg"
                    alt="SmartCookie Logo"
                    height={28}
                    width={14}
                    className="shrink-0"
                  />
                  <span className="text-xl font-bold text-primary">
                    SmartCookie
                  </span>
                </div>
                <p className="text-sm  leading-relaxed max-w-sm">
                  {tFooter("description")}
                </p>
              </div>

              {/* Navigation links */}
              <div className="space-y-6 lg:col-span-1">
                <Heading
                  level={3}
                  className="uppercase text-sm sm:text-sm font-semibold"
                >
                  {tFooter("navigation")}
                </Heading>
                <nav className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                  {navigationLinks.map((link) => (
                    <Button
                      key={link.id}
                      onPress={() => handleNavigation(link.id, link.href)}
                      className={linkStyles({
                        intent: "primary",
                        className: "text-left text-sm cursor-pointer",
                      })}
                    >
                      {link.label}
                    </Button>
                  ))}
                </nav>
              </div>

              {/* Social links */}
              <div className="space-y-6 lg:col-span-1">
                <Heading
                  level={3}
                  className="uppercase text-sm sm:text-sm font-semibold"
                >
                  {tFooter("connect")}
                </Heading>
                <div className="space-y-3">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.id}
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
                        {social.name && (
                          <span className="font-medium text-sm">
                            {social.name}
                          </span>
                        )}
                        <span className="text-sm text-muted-fg">
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
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4">
                <LocaleSwitcherSelect intent="plain" size="xs" />
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  intent="primary"
                  className={"font-medium text-sm text-muted-fg"}
                >
                  {tLegal("privacyPolicy")}
                </Link>
                <Link
                  href="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  intent="primary"
                  className={"font-medium text-sm text-muted-fg"}
                >
                  {tLegal("termsOfService")}
                </Link>
                <Link
                  href="/cookie-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  intent="primary"
                  className={"font-medium text-sm text-muted-fg"}
                >
                  {tLegal("cookiePolicy")}
                </Link>
                <Link
                  href="/accessibility-statement"
                  target="_blank"
                  rel="noopener noreferrer"
                  intent="primary"
                  className={"font-medium text-sm text-muted-fg"}
                >
                  {tLegal("accessibilityStatement")}
                </Link>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </footer>
  );
};
