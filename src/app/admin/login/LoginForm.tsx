"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

type Props = {
  redirectTo: string;
};

export default function LoginForm({ redirectTo }: Props) {
  const [state, formAction, isPending] = useActionState(loginAction, {
    error: null,
  });

  return (
    <form action={formAction} className="admin-login__form">
      <input type="hidden" name="redirect" value={redirectTo} />

      {state.error ? (
        <div className="admin-login__error">{state.error}</div>
      ) : null}

      <div className="admin-login__field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
        />
      </div>

      <div className="admin-login__field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        className="admin-login__submit"
        disabled={isPending}
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
