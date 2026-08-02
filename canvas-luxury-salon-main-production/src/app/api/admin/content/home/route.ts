import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import type { HomeContent } from "@/lib/cms-types";
import { getHomeContent, saveHomeContent } from "@/lib/content-store";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  return NextResponse.json(await getHomeContent());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const body = (await request.json()) as HomeContent;
    if (!body?.hero?.headlineBefore) {
      return NextResponse.json({ error: "Invalid home content." }, { status: 400 });
    }
    const saved = await saveHomeContent(body);
    revalidatePath("/");
    revalidatePath("/book");
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
