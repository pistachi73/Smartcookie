import Image from "next/image";
import { useState } from "react";

import { Button, buttonStyles } from "@/shared/components/ui/button";
import { Link } from "@/shared/components/ui/link";
import { Sheet } from "@/shared/components/ui/sheet";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { cn } from "@/shared/lib/classes";

import { useRouter } from "@/i18n/navigation";
import {
  buttonCustomStyles,
  useHandleNavigation,
  useNavigationLinks,
} from "../index";
import { HeaderMobileSheetTrigger } from "./header-mobile-sheet-trigger";

export const MobileSheet = () => {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const navigationLinks = useNavigationLinks();
  const handleNavigation = useHandleNavigation();
  const router = useRouter();

  const goToLogin = () => {
    setIsOpen(false);

    setTimeout(() => {
      router.push("/login");
    }, 100);
  };

  return (
    <Sheet isOpen={isOpen} onOpenChange={setIsOpen}>
      <HeaderMobileSheetTrigger />
      <Sheet.Content side="left">
        <Sheet.Header className="border-b pb-4">
          <div className="px-2 flex items-center gap-3">
            <Image
              src="/logos/smartcookie_logo.svg"
              alt="SmartCookie"
              height={36}
              width={18}
            />
            <p className="text-xl sm:text-2xl font-semibold">SmartCookie</p>
          </div>
        </Sheet.Header>

        <Sheet.Body className="space-y-2 py-4 ">
          {navigationLinks.map((item) => (
            <Button
              key={item.id}
              className="text-left text-base sm:text-lg justify-start h-12"
              intent="plain"
              size="lg"
              onPress={() => {
                handleNavigation(item.id, item.href);
                setIsOpen(false);
              }}
            >
              {item.label}
            </Button>
          ))}
        </Sheet.Body>
        <Sheet.Footer className="border-t flex-col pt-4 justify-end sm:w-full">
          {user ? (
            <Link
              href="/portal/dashboard"
              className={cn(
                buttonStyles({ size: "lg", intent: "outline" }),
                "group",
                buttonCustomStyles,
              )}
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Button
                onPress={() => {
                  goToLogin();
                }}
                intent="outline"
                size="lg"
                className={cn("text-base sm:flex-1", buttonCustomStyles)}
              >
                Log in
              </Button>
              <Button
                onPress={() => {
                  goToLogin();
                }}
                intent="secondary"
                size="lg"
                className={cn("text-base sm:flex-1", buttonCustomStyles)}
              >
                Start free trial
              </Button>
            </>
          )}
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
};
