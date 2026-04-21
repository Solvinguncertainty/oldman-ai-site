"use client";

import { useState } from "react";

type Props = {
  slug: string;
  inStock: boolean;
  label: string;
};

export default function BuyButton({ slug, inStock, label }: Props) {
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
        body: JSON.stringify({ slug, quantity: 1 }),
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
          className="craft-btn craft-btn--disabled"
          disabled
        >
          Sold out
        </button>
        <p className="craft-product-note">
          To be notified when restocked, email greg@oldmanaisolutions.com
        </p>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className="craft-btn"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? "Opening checkout..." : label}
      </button>
      {error ? (
        <p className="craft-product-note" style={{ color: "var(--craft-ember)" }}>
          {error}
        </p>
      ) : (
        <p className="craft-product-note">
          Secure checkout via Stripe &bull; Ships from Lethbridge, Alberta
        </p>
      )}
    </>
  );
}
