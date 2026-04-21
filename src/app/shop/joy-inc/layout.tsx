import type { Metadata } from "next";
import "./joy.css";

export const metadata: Metadata = {
  title: "Joy Inc. — Handmade resin art and gifts that bring joy",
  description:
    "Joy Inc. is the workshop of Bethany. Handmade resin art, knickknacks, and one-of-a-kind gifts — little objects, big joy.",
  openGraph: {
    title: "Joy Inc.",
    description: "Little objects. Big joy. Handmade resin and gifts by Bethany.",
    type: "website",
  },
};

export default function JoyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="joy-root">{children}</div>;
}
