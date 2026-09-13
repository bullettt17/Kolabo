import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUserId, getUserRole } from "@/lib/auth";
import { getConversationsForUser } from "@/lib/conversations";

export default async function MessagesPage() {
  const userId = await requireUserId();
  const role = await getUserRole();
  if (!role) redirect("/onboarding");

  const conversations = await getConversationsForUser(userId, role);

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
      <p className="mt-1 text-slate-600">
        {role === "creator"
          ? "Conversations started by businesses interested in working with you."
          : "Conversations you've started with creators."}
      </p>

      {conversations.length === 0 ? (
        <div className="card mt-8 text-center">
          <p className="font-medium text-slate-900">No conversations yet</p>
          <p className="mt-1 text-sm text-slate-500">
            {role === "business"
              ? "Browse the directory and contact a creator to get started."
              : "Once a business reaches out, you&apos;ll see it here."}
          </p>
          {role === "business" && (
            <Link href="/creators" className="btn-primary mt-4 inline-flex">
              Browse creators
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-8 divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/messages/${c.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50"
            >
              <div className="flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-100 font-bold text-brand-700">
                {c.otherPartyAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.otherPartyAvatar}
                    alt={c.otherPartyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  c.otherPartyName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">
                  {c.otherPartyName}
                </p>
                <p className="text-sm text-slate-500">
                  {c.lastMessageAt
                    ? new Date(c.lastMessageAt).toLocaleString()
                    : "No messages yet"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
