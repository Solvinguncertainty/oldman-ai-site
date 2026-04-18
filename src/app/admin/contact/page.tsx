import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "../admin.css";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { markRead, markUnread, deleteSubmission } from "./actions";

export const metadata: Metadata = {
  title: "Contact submissions — Admin",
  robots: { index: false, follow: false },
};

type Submission = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  interest: string | null;
  message: string | null;
  read_at: string | null;
  created_at: string;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminContactPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const admin = createAdminClient();
  const { data: submissions, error: subError } = await admin
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const tableMissing =
    !!subError && /relation .* does not exist/i.test(subError.message);

  if (tableMissing) {
    return (
      <div className="admin-shell">
        <header className="admin-topbar">
          <div className="admin-topbar__brand">
            <strong>Oldman AI Solutions</strong>
            <span>Admin</span>
          </div>
          <div className="admin-topbar__actions">
            <span className="admin-topbar__user">{user.email}</span>
            <form action="/admin/logout" method="post">
              <button type="submit" className="admin-topbar__logout">
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main className="admin-main">
          <p className="admin-breadcrumb">
            <a href="/admin">Dashboard</a> &rsaquo; Contact submissions
          </p>
          <h1>Contact submissions</h1>
          <div className="admin-empty-state">
            <h3>Database table not created yet.</h3>
            <p>
              Open Supabase &rarr; SQL Editor and run migration{" "}
              <code>0002_contact_submissions.sql</code>. Then refresh this page.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const list = (submissions ?? []) as Submission[];
  const unreadCount = list.filter((s) => !s.read_at).length;

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          <strong>Old Man AI Solutions</strong>
          <span>Admin</span>
        </div>
        <div className="admin-topbar__actions">
          <span className="admin-topbar__user">{user.email}</span>
          <form action="/admin/logout" method="post">
            <button type="submit" className="admin-topbar__logout">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="admin-main">
        <p className="admin-breadcrumb">
          <a href="/admin">Dashboard</a> &rsaquo; Contact submissions
        </p>

        <div className="admin-page-header">
          <div>
            <h1>Contact submissions</h1>
            <p className="lead">
              {list.length === 0
                ? "No messages yet."
                : `${list.length} total${unreadCount > 0 ? ` — ${unreadCount} unread` : ""}.`}
            </p>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="admin-empty-state">
            <h3>Inbox zero.</h3>
            <p>
              Messages from the contact form on oldmanaisolutions.com will
              appear here.
            </p>
          </div>
        ) : (
          <div className="admin-submissions">
            {list.map((s) => {
              const unread = !s.read_at;
              const boundMarkRead = markRead.bind(null, s.id);
              const boundMarkUnread = markUnread.bind(null, s.id);
              const boundDelete = deleteSubmission.bind(null, s.id);
              return (
                <article
                  key={s.id}
                  className={`admin-submission${unread ? " admin-submission--unread" : ""}`}
                >
                  <div>
                    <div className="admin-submission__head">
                      {unread && <span className="admin-dot" />}
                      <span className="admin-submission__name">{s.name}</span>
                      <a
                        href={`mailto:${s.email}`}
                        className="admin-submission__email"
                      >
                        {s.email}
                      </a>
                      {s.interest && (
                        <span className="admin-submission__interest">
                          {s.interest}
                        </span>
                      )}
                    </div>
                    <div className="admin-submission__meta">
                      {s.organization ? `${s.organization} · ` : ""}
                      {formatDate(s.created_at)}
                    </div>
                    {s.message && (
                      <div className="admin-submission__message">
                        {s.message}
                      </div>
                    )}
                  </div>
                  <div className="admin-submission__actions">
                    {unread ? (
                      <form action={boundMarkRead}>
                        <button
                          type="submit"
                          className="admin-btn admin-btn--ghost"
                          style={{ fontSize: "0.78rem", padding: "6px 12px" }}
                        >
                          Mark read
                        </button>
                      </form>
                    ) : (
                      <form action={boundMarkUnread}>
                        <button
                          type="submit"
                          className="admin-btn admin-btn--ghost"
                          style={{ fontSize: "0.78rem", padding: "6px 12px" }}
                        >
                          Mark unread
                        </button>
                      </form>
                    )}
                    <form action={boundDelete}>
                      <button
                        type="submit"
                        className="admin-btn admin-btn--ghost"
                        style={{
                          fontSize: "0.78rem",
                          padding: "6px 12px",
                          color: "#B4332A",
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
