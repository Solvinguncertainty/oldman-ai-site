"use client";

import { useState } from "react";

type Props = {
  slug: string;
  storeSlug: string;
  inStock: boolean;
  label: string;
};

export default function JoyBuyButton({
  slug,
  storeSlug,
  inStock,
  label,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!inStock || isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, store: storeSlug, quantity: 1 }),
      });
      const data = (await res.json().catch(() => null)) as {
        url?: string;
        error?: string;
      } | null;
      if (!res.ok || !data?.url) {
        setError(
          data?.error ??
            "Checkout couldn't start. Please email greg@oldmanaisolutions.com."
        );
        setIsLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(
        "Network error. Please email greg@oldmanaisolutions.com to order."
      );
      setIsLoading(false);
    }
  }

  if (!inStock) {
    return (
      <>
        <button
          type="button"
          className="joy-btn joy-btn--disabled"
          disabled
        >
          Sold out
        </button>
        <p className="joy-product-note">
          To be notified when restocked, email greg@oldmanaisolutions.com
        </p>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className="joy-btn"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? "Opening checkout..." : label}
      </button>
      {error ? (
        <p className="joy-product-note" style={{ color: "#B85858" }}>
          {error}
        </p>
      ) : (
        <p className="joy-product-note">
          Secure checkout via Stripe &bull; Made &amp; shipped by Bethany
        </p>
      )}
    </>
  );
}
