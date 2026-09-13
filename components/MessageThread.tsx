"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import clsx from "clsx";
import Link from "next/link";
import type { Message } from "@/lib/types";

export default function MessageThread({
  conversationId,
  initialMessages,
  currentUserId,
  canSend,
  subscriptionRequiredMessage,
}: {
  conversationId: string;
  initialMessages: Message[];
  currentUserId: string;
  canSend: boolean;
  subscriptionRequiredMessage: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setMessages((prev) => [...prev, data.message]);
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] flex-col rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">
            No messages yet — say hello and start the conversation.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.sender_user_id === currentUserId;
          return (
            <div
              key={m.id}
              className={clsx("flex", mine ? "justify-end" : "justify-start")}
            >
              <div
                className={clsx(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                  mine
                    ? "bg-brand-500 text-white"
                    : "bg-slate-100 text-slate-900"
                )}
              >
                <p className="whitespace-pre-line">{m.body}</p>
                <p
                  className={clsx(
                    "mt-1 text-[11px]",
                    mine ? "text-brand-100" : "text-slate-400"
                  )}
                >
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-100 p-4">
        {subscriptionRequiredMessage ? (
          <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {subscriptionRequiredMessage}{" "}
            <Link href="/dashboard/business" className="font-semibold underline">
              Go to billing
            </Link>
          </div>
        ) : (
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              className="input"
              placeholder="Write a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={4000}
              disabled={!canSend || sending}
            />
            <button
              type="submit"
              disabled={!canSend || sending || !draft.trim()}
              className="btn-primary"
            >
              Send
            </button>
          </form>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
