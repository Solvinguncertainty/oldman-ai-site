import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Old Man AI Solutions — People First. AI as the Tool.",
  description:
    "A human-centered problem-solving firm. Speaking, training, and building for the age of AI. Grounded in reality, not hype.",
  openGraph: {
    title: "Old Man AI Solutions — People First. AI as the Tool.",
    description:
      "Speaking, training, and building for the age of AI. A human-centered problem-solving firm grounded in reality, not hype.",
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
