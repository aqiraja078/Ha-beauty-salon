import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SlipDocument } from "@/components/slips/SlipDocument";
import { SlipPublicActions } from "@/components/slips/SlipPublicActions";
import { getSiteContent } from "@/lib/content-store";
import { getSlipByPublicId } from "@/lib/slips-store";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ publicId: string }>;
  searchParams: Promise<{ print?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicId } = await params;
  const slip = await getSlipByPublicId(publicId);
  return {
    title: slip ? `Slip ${slip.number}` : "Slip",
    robots: { index: false, follow: false },
  };
}

export default async function PublicSlipPage({ params, searchParams }: Props) {
  const { publicId } = await params;
  const { print } = await searchParams;
  const [slip, site] = await Promise.all([
    getSlipByPublicId(publicId),
    getSiteContent(),
  ]);
  if (!slip) notFound();

  return (
    <div className="px-4 py-8 sm:py-12">
      <style>{`@media print { body { background: #fff !important; } body::before, body::after { display: none !important; } @page { margin: 12mm; } }`}</style>
      <SlipPublicActions autoPrint={print === "1"} />
      <SlipDocument slip={slip} site={site} />
    </div>
  );
}
