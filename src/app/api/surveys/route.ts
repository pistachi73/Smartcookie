import type { SortBy } from "@/data-access/questions/schemas";
import { getSurveyTemplates } from "@/data-access/survey-templates/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const sortBy = searchParams.get("sortBy");
  const q = searchParams.get("q");

  const result = await getSurveyTemplates({
    page: page ? Number.parseInt(page) : 1,
    pageSize: pageSize ? Number.parseInt(pageSize) : 10,
    sortBy: sortBy as SortBy,
    q: q as string,
  });

  return NextResponse.json(result);
}
