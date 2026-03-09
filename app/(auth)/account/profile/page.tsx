import { PageLayout } from "@/components/layout/page-layout";
import { getUserProfile } from "@/lib/supabase/user-profiles";
import { getRequiredUser } from "@/lib/supabase/server";
import { DisplayNameForm } from "@/components/settings/display-name-form";
import { messages } from "@/lib/messages";

async function ProfileContent() {
  const user = await getRequiredUser();
  const profile = await getUserProfile(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          {messages.account.profile ?? "Profil"}
        </h1>
        <p className="text-muted-foreground">
          {messages.account.profileDescription ?? "Cum vrei să apară numele tău la recenzii"}
        </p>
      </div>
      <DisplayNameForm
        initialDisplayName={profile?.full_name || ""}
        userId={user.id}
      />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <PageLayout maxWidth="4xl" padding="relaxed">
      <ProfileContent />
    </PageLayout>
  );
}
