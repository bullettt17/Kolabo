import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireUserId, getUserRole } from "@/lib/auth";
import { getConversationForParticipant } from "@/lib/conversations";
import { businessHasActiveSubscription } from "@/lib/subscription";
import MessageThread from "@/components/MessageThread";

export default async function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const userId = await requireUserId();
  const role = await getUserRole();
  if (!role) redirect("/onboarding");

  const detail = await getConversationForParticipant(
    params.conversationId,
    userId,
    role
  );
  if (!detail) notFound();

  const otherParty =
    role === "creator"
      ? { name: detail.business.company_name, avatar: detail.business.logo_url, href: null }
      : {
          name: detail.creator.display_name,
          avatar: detail.creator.avatar_url,
          href: `/creators/${detail.creator.id}`,
        };

  const canSend =
    role === "creator" ||
    (role === "business" && (await businessHasActiveSubscription(detail.business.id)));

  return (
    <div className="container-page flex flex-col py-10">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/messages" className="btn-ghost">
          ← Back
        </Link>
        <div>
          <p className="font-semibold text-slate-900">
            {otherParty.href ? (
              <Link href={otherParty.href} className="hover:text-brand-600">
                {otherParty.name}
              </Link>
            ) : (
              otherParty.name
            )}
          </p>
        </div>
      </div>

      <MessageThread
        conversationId={detail.conversation.id}
        initialMessages={detail.messages}
        currentUserId={userId}
        canSend={canSend}
        subscriptionRequiredMessage={
          !canSend
            ? "Your business subscription is inactive. Reactivate it from your dashboard to keep messaging."
            : null
        }
      />
    </div>
  );
}
