import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { SearchField } from "@/shared/components/ui/search-field";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";

import { validateStudentsSearchParams } from "../../lib/validate-students-search-params";

export const StudentsTableSearch = () => {
  const searchParams = useSearchParams();
  const { createHrefWithParams } = useNavigateWithParams();
  const router = useRouter();
  const pathname = usePathname();
  const { q } = validateStudentsSearchParams(searchParams);

  const [query, setQuery] = useState(q);

  useDebouncedValue(query, 300, (value) => {
    let query: string | null = value;
    if (!value || !value.trim()) {
      query = null;
    }
    const href = createHrefWithParams(pathname, { q: query, page: null });
    router.push(href);
  });
  return (
    <SearchField
      value={query}
      onChange={(value) => setQuery(value)}
      placeholder="Search students..."
      className={{
        fieldGroup: "h-10 w-64",
      }}
    />
  );
};
