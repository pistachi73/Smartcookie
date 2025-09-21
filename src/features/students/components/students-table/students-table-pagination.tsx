import { useSearchParams } from "next/navigation";

import { Pagination } from "@/shared/components/ui/pagination";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";

import { usePathname } from "@/i18n/navigation";
import { validateStudentsSearchParams } from "../../lib/validate-students-search-params";

export const StudentsTablePagination = ({
  totalPages,
}: {
  totalPages: number;
}) => {
  const searchParams = useSearchParams();

  const { page } = validateStudentsSearchParams(searchParams);
  const pathname = usePathname();
  const { createHrefWithParams } = useNavigateWithParams();

  return (
    <Pagination className="w-fit mx-0">
      <Pagination.List>
        <Pagination.Item
          segment="first"
          isDisabled={page === 1}
          href={createHrefWithParams(pathname, { page: null })}
        />
        <Pagination.Item
          segment="previous"
          isDisabled={page === 1}
          href={createHrefWithParams(pathname, { page: String(page - 1) })}
        />
        <Pagination.Section
          aria-label="Pagination Segment"
          className="rounded-lg border "
        >
          <Pagination.Item segment="label">{page}</Pagination.Item>
          <Pagination.Item segment="separator" />
          <Pagination.Item className="text-muted-fg" segment="label">
            {totalPages}
          </Pagination.Item>
        </Pagination.Section>
        <Pagination.Item
          segment="next"
          isDisabled={page === totalPages}
          href={createHrefWithParams(pathname, { page: String(page + 1) })}
        />
        <Pagination.Item
          isDisabled={page === totalPages}
          segment="last"
          href={createHrefWithParams(pathname, { page: String(totalPages) })}
        />
      </Pagination.List>
    </Pagination>
  );
};
