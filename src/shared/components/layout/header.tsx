"use client";

import { ThemeSwitcher } from "@/ui/theme-switcher";
import { MaxWidthWrapper } from "./max-width-wrapper";

import { AuthButton } from "@/features/auth/components/auth-button";
import { UserButton } from "@/features/auth/components/user-button";
import { useCurrentUser } from "@/shared/hooks/use-current-user";

export const Header = () => {
  const user = useCurrentUser();

  return (
    <header className="border-b border-input">
      <MaxWidthWrapper className="flex items-center justify-between h-14">
        <nav>Logo</nav>
        <div className="flex flex-row gap-2">
          <ThemeSwitcher />
          {user ? <UserButton /> : <AuthButton>Sign in</AuthButton>}
        </div>
      </MaxWidthWrapper>
    </header>
  );
};
