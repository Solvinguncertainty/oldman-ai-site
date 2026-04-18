import fs from "node:fs";
import path from "node:path";
import ClientScripts from "./ClientScripts";

// The body content is ported directly from the original static site (v1).
// We render it via dangerouslySetInnerHTML to preserve pixel-perfect parity
// with the pre-Next.js design. Future work can refactor sections into JSX
// components incrementally.
const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "src/app/_body.html"),
  "utf8"
);

export default function HomePage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <ClientScripts />
    </>
  );
}
