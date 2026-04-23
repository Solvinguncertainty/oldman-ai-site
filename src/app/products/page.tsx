import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import ClientScripts from "../ClientScripts";

export const metadata: Metadata = {
  title: "Products — Oldman AI Solutions",
  description:
    "Five products in two months. Proof of capability across longevity, construction, human orientation, baking, and on-site AI infrastructure.",
};

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "src/app/products/_products.html"),
  "utf8"
);

export default function ProductsPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <ClientScripts />
    </>
  );
}
