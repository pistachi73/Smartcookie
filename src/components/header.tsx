"use client";

import { UserButton } from "./auth/user-button";
import { MaxWidthWrapper } from "./max-width-wrapper";

import { useCurrentUser } from "@/hooks/use-current-user";
import { AuthButton } from "./auth/auth-button";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "./ui/theme-switcher";

export const Header = () => {
  const user = useCurrentUser();

  return (
    <header className="border-b border-input">
      <MaxWidthWrapper className="flex items-center justify-between h-14">
        <nav>Logo</nav>
        <div className="flex flex-row gap-2">
          <ThemeSwitcher />
          {user ? (
            <UserButton user={user} />
          ) : (
            <AuthButton asChild>
              <Button variant="ghost" size="default" className="2xl">
                Sign in
              </Button>
            </AuthButton>
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
};
