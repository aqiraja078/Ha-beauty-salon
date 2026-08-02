import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import type { SiteContent } from "@/lib/cms-types";
import { getSiteContent, saveSiteContent } from "@/lib/content-store";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const body = (await request.json()) as SiteContent;
    if (!body?.name?.trim() || !body?.phone?.trim()) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 }
      );
    }
    const saved = await saveSiteContent(body);
    revalidatePath("/", "layout");
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
