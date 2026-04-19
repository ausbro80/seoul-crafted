import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { sendAdminReply, markConversationRead } from "./actions";

export const dynamic = "force-dynamic";

type ConvoListRow = {
  id: string;
  customer_email: string;
  channel: "guide" | "support";
  last_message_at: string | null;
  created_at: string;
  messages: {
    id: string;
    body: string;
    sender: string;
    read_at: string | null;
    created_at: string;
  }[] | null;
};

type ThreadMessage = {
  id: string;
  sender: "customer" | "guide" | "support";
  body: string;
  read_at: string | null;
  created_at: string;
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c: selectedId } = await searchParams;
  const supabase = await createClient();

  const { data: convos } = await supabase
    .from("conversations")
    .select(
      "id, customer_email, channel, last_message_at, created_at, messages(id, body, sender, read_at, created_at)",
    )
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .returns<ConvoListRow[]>();

  const list = convos ?? [];
  const selected = selectedId ? list.find((x) => x.id === selectedId) : undefined;

  let thread: ThreadMessage[] = [];
  if (selected) {
    const { data } = await supabase
      .from("messages")
      .select("id, sender, body, read_at, created_at")
      .eq("conversation_id", selected.id)
      .order("created_at", { ascending: true })
      .returns<ThreadMessage[]>();
    thread = data ?? [];
  }

  return (
    <PageShell
      title="Messages"
      description="Customer threads — one per (customer, channel) pair."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
        {/* Conversation list */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {list.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                No conversations yet.
              </div>
            ) : (
              <div className="divide-y">
                {list.map((c) => {
                  const unread = (c.messages ?? []).filter(
                    (m) => m.sender === "customer" && !m.read_at,
                  ).length;
                  const latest = (c.messages ?? [])
                    .slice()
                    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
                  const active = selectedId === c.id;
                  return (
                    <Link
                      key={c.id}
                      href={`/admin/messages?c=${c.id}`}
                      className={`block px-4 py-3 hover:bg-muted/40 ${active ? "bg-muted/60" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-medium">
                          {c.customer_email}
                        </div>
                        {unread > 0 ? (
                          <Badge
                            variant="secondary"
                            className="bg-[var(--brand-soft)] text-[var(--brand)] hover:bg-[var(--brand-soft)]"
                          >
                            {unread}
                          </Badge>
                        ) : null}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium uppercase tracking-[0.14em]">
                          {c.channel}
                        </span>
                        {latest ? (
                          <span className="truncate">
                            {latest.sender === "customer" ? "" : "→ "}
                            {latest.body}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Thread pane */}
        <Card className="overflow-hidden">
          {!selected ? (
            <CardContent className="flex h-[60vh] items-center justify-center text-sm text-muted-foreground">
              Select a conversation to open the thread.
            </CardContent>
          ) : (
            <div className="flex h-[70vh] flex-col">
              <div className="flex items-center justify-between border-b px-5 py-3">
                <div>
                  <div className="text-sm font-semibold">
                    {selected.customer_email}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {selected.channel} channel
                  </div>
                </div>
                <form action={markConversationRead.bind(null, selected.id)}>
                  <Button type="submit" variant="ghost" size="sm">
                    Mark read
                  </Button>
                </form>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {thread.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground">
                    No messages.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {thread.map((m) => {
                      const fromAdmin =
                        m.sender === "support" || m.sender === "guide";
                      return (
                        <div
                          key={m.id}
                          className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${fromAdmin ? "self-end bg-primary text-primary-foreground" : "self-start bg-muted"}`}
                        >
                          <div className="whitespace-pre-wrap">{m.body}</div>
                          <div
                            className={`mt-1 text-[10px] ${fromAdmin ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                          >
                            {m.sender}
                            {" · "}
                            {new Date(m.created_at).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <form
                action={sendAdminReply.bind(null, selected.id)}
                className="flex gap-2 border-t p-3"
              >
                <input
                  type="hidden"
                  name="sender_role"
                  value={selected.channel}
                />
                <input
                  name="body"
                  placeholder={`Reply as ${selected.channel}…`}
                  className="flex-1 rounded-full border bg-background px-4 py-2 text-sm"
                  autoComplete="off"
                />
                <Button type="submit">Send</Button>
              </form>
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
