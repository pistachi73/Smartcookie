"use client";

import { Button } from "@/shared/components/ui/button";
import { Menu } from "@/shared/components/ui/menu";

import type { SortBy } from "@/data-access/questions/schemas";
import { Pagination } from "@/shared/components/ui/pagination";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import {
  ArrangeByLettersAZIcon,
  ArrangeByNumbers91Icon,
  Clock05Icon,
  PreferenceHorizontalIcon,
  SearchIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "react-aria-components";
import { validateSearchParams } from "../lib/validate-search-params";

const sortByOptions: {
  label: string;
  value: SortBy;
  icon: typeof ArrangeByLettersAZIcon;
}[] = [
  {
    label: "Alphabetically",
    value: "alphabetical",
    icon: ArrangeByLettersAZIcon,
  },
  {
    label: "Most responses",
    value: "response-count",
    icon: ArrangeByNumbers91Icon,
  },
  {
    label: "Newest",
    value: "newest",
    icon: Clock05Icon,
  },
];

type SidebarPanelProps = {
  children: React.ReactNode;
  isLoading: boolean;
  totalItems: number;
  totalPages: number;
  panel: "questions" | "surveys";
};

export const SidebarPanel = ({
  children,
  isLoading,
  totalItems,
  totalPages,
  panel,
}: SidebarPanelProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { createHrefWithParams } = useNavigateWithParams();
  const searchParams = useSearchParams();
  const { page, sortBy, q } = validateSearchParams(searchParams);
  const [query, setQuery] = useState(q);

  useDebouncedValue(query, 300, (value) => {
    let query: string | null = value;
    if (!value || !value.trim()) {
      query = null;
    }
    const href = createHrefWithParams(pathname, { q: query, page: null });
    router.push(href);
  });

  const validTotalPages = Math.max(1, totalPages);

  useEffect(() => {
    // Redirect to page 1 if current page exceeds total pages or is invalid
    if (page > validTotalPages) {
      router.push(
        createHrefWithParams(pathname, {
          page: "1",
          sortBy,
          q: null,
        }),
      );
    }
  }, [validTotalPages, page, pathname, router, createHrefWithParams, sortBy]);

  return (
    <div className="h-full grid grid-cols-1 grid-rows-[auto_1fr_auto]">
      <div className="border-b p-4 py-3 flex flex-row items-center gap-2">
        <div className="flex items-center gap-3 flex-1">
          <HugeiconsIcon
            icon={SearchIcon}
            strokeWidth={2}
            size={16}
            className="text-muted-fg"
          />
          <Input
            placeholder="Search..."
            className="flex-1 h-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Menu>
          <Button size="square-petite" intent="outline">
            <HugeiconsIcon
              icon={PreferenceHorizontalIcon}
              size={16}
              data-slot="icon"
            />
          </Button>
          <Menu.Content placement="bottom" showArrow className="w-[200px]">
            <Menu.Header separator>Sort by</Menu.Header>
            {sortByOptions.map((option) => (
              <Menu.Item
                key={`sort-${option.value}`}
                id={`sort-${option.value}`}
                href={createHrefWithParams(pathname, {
                  sortBy: option.value,
                  page: null,
                })}
                isSelected={sortBy === option.value}
                className="flex items-center justify-between gap-2"
              >
                <p className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={option.icon}
                    size={16}
                    data-slot="icon"
                  />
                  {option.label}
                </p>
                {sortBy === option.value && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu>
      </div>

      <div className="overflow-y-auto flex-1">{children}</div>
      <div className="p-4 py-3 border-t border-border-primary flex justify-between items-center gap-2">
        <p className="text-xs text-muted-fg truncate flex-auto first-letter:capitalize">
          {isLoading
            ? "Loading..."
            : totalItems > 0
              ? `${panel} ${(page - 1) * 10 + 1}-${Math.min(page * 10, totalItems)} of ${totalItems}`
              : "No results"}
        </p>

        {totalItems === 0 && !isLoading ? (
          <div className="h-9 flex items-center">
            <p className="text-xs text-muted-fg">Page 1 of 1</p>
          </div>
        ) : (
          <Pagination className="justify-end flex-auto w-fit">
            <Pagination.List>
              <Pagination.Item
                routerOptions={{ scroll: false }}
                segment="first"
                href={createHrefWithParams(pathname, {
                  page: "1",
                })}
                isDisabled={page === 1 || validTotalPages === 1}
              />
              <Pagination.Item
                routerOptions={{ scroll: false }}
                segment="previous"
                href={createHrefWithParams(pathname, {
                  page: `${Math.max(1, page - 1)}`,
                })}
                isDisabled={page === 1 || validTotalPages === 1}
              />
              <Pagination.Section
                aria-label="Pagination Segment"
                className="rounded-lg border"
              >
                <Pagination.Item
                  routerOptions={{ scroll: false }}
                  segment="label"
                >
                  {page}
                </Pagination.Item>
                <Pagination.Item
                  routerOptions={{ scroll: false }}
                  segment="separator"
                />
                <Pagination.Item
                  routerOptions={{ scroll: false }}
                  className="text-muted-fg"
                  segment={isLoading ? "ellipsis" : "label"}
                >
                  {validTotalPages}
                </Pagination.Item>
              </Pagination.Section>
              <Pagination.Item
                routerOptions={{ scroll: false }}
                segment="next"
                href={createHrefWithParams(pathname, {
                  page: `${Math.min(validTotalPages, page + 1)}`,
                })}
                isDisabled={page === validTotalPages || validTotalPages === 1}
              />
              <Pagination.Item
                routerOptions={{ scroll: false }}
                segment="last"
                href={createHrefWithParams(pathname, {
                  page: `${validTotalPages}`,
                })}
                isDisabled={page === validTotalPages || validTotalPages === 1}
              />
            </Pagination.List>
          </Pagination>
        )}
      </div>
    </div>
  );
};
