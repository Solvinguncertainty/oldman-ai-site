import type { Metadata } from "next";
import "../admin.css";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Sign in — Oldman AI Solutions",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { redirect } = await searchParams;
  const safeRedirect =
    redirect && redirect.startsWith("/admin") ? redirect : "/admin";

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <img
          src="/logo.svg"
          alt="Oldman AI Solutions"
          className="admin-login__logo"
        />
        <h1 className="admin-login__title">Admin Sign in</h1>
        <p className="admin-login__subtitle">
          Authorized personnel only.
        </p>

        <LoginForm redirectTo={safeRedirect} />

        <p className="admin-login__footer">
          <a href="/">&larr; Back to site</a>
        </p>
      </div>
    </div>
  );
}
