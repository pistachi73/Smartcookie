import type { SortBy } from "@/features/feedback/lib/questions.schema";
import { getSurveysUseCase } from "@/features/feedback/use-cases/survey-templates.use-case";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const sortBy = searchParams.get("sortBy");
  const q = searchParams.get("q");

  const result = await getSurveysUseCase({
    page: page ? Number.parseInt(page) : 1,
    pageSize: pageSize ? Number.parseInt(pageSize) : 10,
    sortBy: sortBy as SortBy,
    q: q as string,
  });

  return NextResponse.json(result);
}
