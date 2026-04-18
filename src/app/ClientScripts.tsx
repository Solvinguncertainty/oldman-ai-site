"use client";

import { useEffect } from "react";

export default function ClientScripts() {
  useEffect(() => {
    // --- Navigation scroll effect ---
    const nav = document.getElementById("nav");
    const onScroll = () => {
      if (nav) nav.classList.toggle("nav--scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);

    // --- Mobile nav toggle ---
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    const onNavToggleClick = () => {
      navLinks?.classList.toggle("active");
      navToggle?.classList.toggle("active");
    };
    navToggle?.addEventListener("click", onNavToggleClick);

    // Close mobile nav on link click
    const navLinkEls = navLinks ? Array.from(navLinks.querySelectorAll("a")) : [];
    const onNavLinkClick = () => {
      navLinks?.classList.remove("active");
      navToggle?.classList.remove("active");
    };
    navLinkEls.forEach((l) => l.addEventListener("click", onNavLinkClick));

    // --- Smooth scroll offset for fixed nav ---
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    );
    const anchorHandlers = anchors.map((anchor) => {
      const handler = (e: Event) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const position =
            target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: position, behavior: "smooth" });
        }
      };
      anchor.addEventListener("click", handler);
      return { anchor, handler };
    });

    // --- Contact form handling (posts to /api/contact) ---
    const contactForm = document.getElementById(
      "contactForm"
    ) as HTMLFormElement | null;
    const onContactSubmit = async (e: Event) => {
      e.preventDefault();
      if (!contactForm) return;
      const btn = contactForm.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement | null;
      if (!btn) return;
      const originalText = btn.textContent;

      const payload = {
        firstName: (contactForm.querySelector("#firstName") as HTMLInputElement | null)?.value ?? "",
        org: (contactForm.querySelector("#org") as HTMLInputElement | null)?.value ?? "",
        email: (contactForm.querySelector("#email") as HTMLInputElement | null)?.value ?? "",
        interest: (contactForm.querySelector("#interest") as HTMLSelectElement | null)?.value ?? "",
        message: (contactForm.querySelector("#message") as HTMLTextAreaElement | null)?.value ?? "",
        website: (contactForm.querySelector('input[name="website"]') as HTMLInputElement | null)?.value ?? "",
      };

      btn.textContent = "Sending...";
      btn.disabled = true;

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          btn.textContent = "Message Sent \u2713";
          btn.style.background = "var(--amber)";
          btn.style.color = "var(--bg)";
          contactForm.reset();
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = "";
            btn.style.color = "";
            btn.disabled = false;
          }, 4000);
        } else {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          btn.textContent = "Try again";
          btn.disabled = false;
          alert(data?.error ?? "Something went wrong. Please email greg@oldmanaisolutions.com.");
        }
      } catch {
        btn.textContent = "Try again";
        btn.disabled = false;
        alert("Network error. Please email greg@oldmanaisolutions.com.");
      }
    };
    contactForm?.addEventListener("submit", onContactSubmit);

    // --- Field Notes form handling (Kit) ---
    const fieldNotesForm = document.getElementById(
      "fieldNotesForm"
    ) as HTMLFormElement | null;
    const onFieldNotesSubmit = (e: Event) => {
      e.preventDefault();
      if (!fieldNotesForm) return;
      const btn = fieldNotesForm.querySelector(
        "button"
      ) as HTMLButtonElement | null;
      const input = fieldNotesForm.querySelector(
        'input[name="email_address"]'
      ) as HTMLInputElement | null;
      if (!btn || !input) return;
      const email = input.value;
      btn.textContent = "Sending...";
      btn.disabled = true;

      fetch("https://app.kit.com/forms/9340479/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: email }),
      })
        .then((res) => {
          if (res.ok || res.redirected) {
            btn.textContent = "Subscribed \u2713";
            fieldNotesForm.reset();
            setTimeout(() => {
              btn.textContent = "Subscribe";
              btn.disabled = false;
            }, 4000);
          } else {
            throw new Error("Subscription failed");
          }
        })
        .catch(() => {
          fieldNotesForm.submit();
          btn.textContent = "Subscribe";
          btn.disabled = false;
        });
    };
    fieldNotesForm?.addEventListener("submit", onFieldNotesSubmit);

    // --- Expandable product cards ---
    const productCards = Array.from(
      document.querySelectorAll<HTMLElement>(".product-card[data-expandable]")
    );
    const productHandlers: { el: HTMLElement; onClick: () => void; toggle?: HTMLElement; onToggleClick?: (e: Event) => void }[] = [];
    productCards.forEach((card) => {
      const toggle = card.querySelector(".product-card__toggle") as HTMLElement | null;
      const onToggleClick = (e: Event) => {
        e.stopPropagation();
        card.classList.toggle("expanded");
      };
      const onClick = () => {
        card.classList.toggle("expanded");
      };
      toggle?.addEventListener("click", onToggleClick);
      card.addEventListener("click", onClick);
      productHandlers.push({ el: card, onClick, toggle: toggle ?? undefined, onToggleClick });
    });

    // --- Scroll-triggered fade-in animations ---
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatables = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".values__item, .offering-card, .audience-item, .method-step, " +
          ".speaking__track, .talk-card, .training__offering-card, " +
          ".consult-card, .process-step, .product-card, " +
          ".listen__card, .about__beliefs, .contact__info-item"
      )
    );

    animatables.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.08}s, transform 0.5s ease ${(i % 4) * 0.08}s`;
      observer.observe(el);
    });

    // --- Stagger grid children ---
    document
      .querySelectorAll<HTMLElement>(
        ".offerings__grid, .products__grid, .audiences__grid, .training__scenarios, .consulting__types, .listen__grid"
      )
      .forEach((grid) => {
        Array.from(grid.children).forEach((child, index) => {
          (child as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
        });
      });

    // --- Inject .visible styles once ---
    if (!document.getElementById("oma-visible-styles")) {
      const style = document.createElement("style");
      style.id = "oma-visible-styles";
      style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
      document.head.appendChild(style);
    }

    // --- Cleanup on unmount ---
    return () => {
      window.removeEventListener("scroll", onScroll);
      navToggle?.removeEventListener("click", onNavToggleClick);
      navLinkEls.forEach((l) => l.removeEventListener("click", onNavLinkClick));
      anchorHandlers.forEach(({ anchor, handler }) =>
        anchor.removeEventListener("click", handler)
      );
      contactForm?.removeEventListener("submit", onContactSubmit);
      fieldNotesForm?.removeEventListener("submit", onFieldNotesSubmit);
      productHandlers.forEach(({ el, onClick, toggle, onToggleClick }) => {
        el.removeEventListener("click", onClick);
        if (toggle && onToggleClick) toggle.removeEventListener("click", onToggleClick);
      });
      observer.disconnect();
    };
  }, []);

  return null;
}
