import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import ClientScripts from "../ClientScripts";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "src/app/copilot/_copilot.html"),
  "utf8"
);

export const metadata: Metadata = {
  title:
    "Applied Prompt Engineering for Regulated Environments — Oldman AI Solutions",
  description:
    "Defensible AI outputs. Inside your tenant. Without IT. We turn Microsoft Copilot from a generic chatbot into a defensible report engine for enterprises restricted to Copilot for AI work.",
  openGraph: {
    title:
      "Applied Prompt Engineering for Regulated Environments — Oldman AI Solutions",
    description:
      "Defensible AI outputs. Inside your tenant. Without IT. Microsoft Copilot consulting for regulated enterprises.",
    type: "website",
    url: "https://www.oldmanaisolutions.com/copilot",
  },
};

export default function CopilotPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <ClientScripts />
    </>
  );
}
