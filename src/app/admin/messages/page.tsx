import { PageShell } from "@/components/page-shell";
import { EmptyPhaseB } from "@/components/empty-phase-b";

export default function MessagesPage() {
  return (
    <PageShell
      title="Messages"
      description="Two-pane inbox. Guide thread + Support thread per customer."
    >
      <EmptyPhaseB
        title="Inbox — coming in Phase B"
        whatsNext={[
          "Two-pane layout: conversation list + thread view",
          "Supabase Realtime subscription for new messages",
          "Tables: conversations (id, customer_id, channel 'guide'|'support', last_message_at) + messages (id, conversation_id, sender, body, created_at)",
          "Optimistic send, read receipts, attachment support",
        ]}
      />
    </PageShell>
  );
}
