"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { cn } from "@/shared/lib/classes";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  isOpenOnMobile: boolean;
  setIsOpenOnMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

interface SidebarProviderProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
  isOpen?: boolean;
  shortcut?: string;
  onOpenChange?: (open: boolean) => void;
}

const SidebarProvider = ({
  defaultOpen = true,
  isOpen: openProp,
  onOpenChange: setOpenProp,
  className,
  children,
  shortcut = "b",
  ref,
  ...props
}: SidebarProviderProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [openMobile, setOpenMobile] = useState(false);

  const [internalOpenState, setInternalOpenState] = useState(defaultOpen);
  const open = openProp ?? internalOpenState;
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;

      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        setInternalOpenState(openState);
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === shortcut && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, shortcut]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      isOpenOnMobile: openMobile,
      setIsOpenOnMobile: setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  );

  return (
    <SidebarContext value={contextValue}>
      <div
        className={cn(
          "@container ",
          "flex h-full w-full min-h-0 text-sidebar-fg",
          "group/sidebar-root has-data-[sidebar-intent=inset]:bg-sidebar dark:has-data-[sidebar-intent=inset]:bg-bg",
          "[--sidebar-width-dock:calc(var(--spacing)*16)]",
          "[--sidebar-width-mobile:18rem]",
          "[--sidebar-width:17rem]",
          "[--sidebar-border:var(--color-border)]",
          "[--sidebar-secondary:color-mix(in_oklab,var(--color-secondary)_60%,white_20%)]",
          "[--sidebar-accent:color-mix(in_oklab,var(--color-accent)_60%,white_20%)]",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    </SidebarContext>
  );
};

const useSidebar = () => {
  const context = use(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar.");
  }

  return context;
};

export { SidebarProvider, useSidebar };
