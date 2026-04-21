import type { Metadata } from "next";
import "./craft.css";

export const metadata: Metadata = {
  title: "The Craft — A workshop of Oldman AI Solutions",
  description:
    "Small batches. Real objects. 3D printed goods from a single workshop in Lethbridge, Alberta.",
  openGraph: {
    title: "The Craft",
    description: "Small batches. Real objects. Built in Lethbridge, Alberta.",
    type: "website",
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="craft-root">{children}</div>;
}
