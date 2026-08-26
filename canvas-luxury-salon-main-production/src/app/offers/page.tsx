import { redirect } from "next/navigation";

/** Legacy URL — Sales page now lives at /sales */
export default function OffersRedirectPage() {
  redirect("/sales");
}
