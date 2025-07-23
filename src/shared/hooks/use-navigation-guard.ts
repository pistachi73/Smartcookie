import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

type NavigationGuardOptions = {
  /**
   * Whether navigation should be guarded
   */
  shouldGuard: boolean;
  /**
   * Callback that will be called when navigation is attempted
   * Should return a Promise that resolves to true if navigation should proceed
   * or false if navigation should be prevented
   */
  onNavigationAttempt: () => Promise<boolean>;
};

export const useNavigationGuard = ({
  shouldGuard,
  onNavigationAttempt,
}: NavigationGuardOptions) => {
  const router = useRouter();

  const handleAnchorClick = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) return; // only handle left-clicks

      const target = e.currentTarget as HTMLAnchorElement;
      if (!target || !target.href) return;

      const targetUrl = target.href;
      const currentUrl = window.location.href;

      if (targetUrl !== currentUrl && shouldGuard) {
        e.preventDefault();

        // Use async IIFE to handle the promise
        (async () => {
          const shouldProceed = await onNavigationAttempt();
          if (shouldProceed) {
            window.location.href = targetUrl;
          }
        })();
      }
    },
    [shouldGuard, onNavigationAttempt],
  );

  const addAnchorListeners = useCallback(() => {
    const anchorElements = document.querySelectorAll("a[href]");
    anchorElements.forEach((anchor) => {
      anchor.addEventListener("click", handleAnchorClick as EventListener);
    });
  }, [handleAnchorClick]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: No need
  useEffect(() => {
    const mutationObserver = new MutationObserver(addAnchorListeners);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    addAnchorListeners();

    return () => {
      mutationObserver.disconnect();
      const anchorElements = document.querySelectorAll("a[href]");
      anchorElements.forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick as EventListener);
      });
    };
  }, [addAnchorListeners]);

  useEffect(() => {
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      if (shouldGuard) {
        e.preventDefault();
        e.returnValue = ""; // required for Chrome
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (shouldGuard) {
        // We need to prevent the default immediately
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);

        // Then show the confirmation dialog
        (async () => {
          const shouldProceed = await onNavigationAttempt();
          if (shouldProceed) {
            // If confirmed, go back
            window.history.back();
          }
        })();
      }
    };

    if (shouldGuard) {
      window.addEventListener("beforeunload", beforeUnloadHandler);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [shouldGuard, onNavigationAttempt]);

  useEffect(() => {
    const originalPush = router.push.bind(router);

    // Override the router push method
    type RouterWithPush = {
      push: (url: string, options?: any) => void;
    };

    (router as RouterWithPush).push = async (url: string, options?: any) => {
      if (shouldGuard) {
        const shouldProceed = await onNavigationAttempt();
        if (shouldProceed) {
          originalPush(url, options);
        }
      } else {
        originalPush(url, options);
      }
    };

    return () => {
      // Restore the original push method
      (router as RouterWithPush).push = originalPush;
    };
  }, [router, shouldGuard, onNavigationAttempt]);
};

// Keep the old hook for backward compatibility
export const useWarnIfUnsavedChanges = ({
  unsaved,
  showConfirmation,
  message = "You have unsaved changes. Are you sure you want to leave?",
}: {
  unsaved: boolean;
  showConfirmation?: () => Promise<boolean>;
  message?: string;
}) => {
  return useNavigationGuard({
    shouldGuard: unsaved,
    onNavigationAttempt: async () => {
      if (showConfirmation) {
        return showConfirmation();
      }

      return window.confirm(message);
    },
  });
};
