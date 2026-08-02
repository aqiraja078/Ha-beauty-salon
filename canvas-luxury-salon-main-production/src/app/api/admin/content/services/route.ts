import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import type {
  CmsServiceCategory,
  ServiceCategorySlug,
  ServiceMenus,
} from "@/lib/cms-types";
import { SERVICE_CATEGORY_SLUGS } from "@/lib/cms-types";
import {
  getServiceMenus,
  saveServiceCategory,
  saveServiceMenus,
} from "@/lib/content-store";

function isSlug(v: string): v is ServiceCategorySlug {
  return (SERVICE_CATEGORY_SLUGS as string[]).includes(v);
}

function revalidateServicePaths() {
  for (const slug of SERVICE_CATEGORY_SLUGS) {
    revalidatePath(`/services/${slug}`);
  }
  revalidatePath("/");
  revalidatePath("/book");
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  return NextResponse.json(await getServiceMenus());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  try {
    const body = (await request.json()) as
      | ServiceMenus
      | { category: ServiceCategorySlug; data: CmsServiceCategory };

    if (
      body &&
      typeof body === "object" &&
      "category" in body &&
      "data" in body
    ) {
      if (!isSlug(body.category) || !body.data?.sections) {
        return NextResponse.json(
          { error: "Invalid category payload." },
          { status: 400 }
        );
      }
      const saved = await saveServiceCategory(body.category, body.data);
      revalidateServicePaths();
      return NextResponse.json(saved);
    }

    const menus = body as ServiceMenus;
    if (!menus?.hair?.sections) {
      return NextResponse.json(
        { error: "Invalid services payload." },
        { status: 400 }
      );
    }
    const saved = await saveServiceMenus(menus);
    revalidateServicePaths();
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
