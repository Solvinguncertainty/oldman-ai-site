import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Old Man AI Solutions — Custom AI Solutions, Consulting & Training",
  description:
    "Custom AI solutions, McKinsey-style business consulting, and training. We build what your business actually needs — or teach you to build it yourself.",
  openGraph: {
    title: "Old Man AI Solutions — Custom AI Solutions, Consulting & Training",
    description:
      "We build custom AI solutions, run full business assessments, and train you to build your own. Real problems, real solutions — not just talk.",
    type: "website",
    url: "https://www.oldmanaisolutions.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
