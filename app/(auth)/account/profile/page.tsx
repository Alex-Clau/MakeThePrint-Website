import { PageLayout } from "@/components/layout/page-layout";
import { getUserProfile } from "@/lib/supabase/user-profiles";
import { getRequiredUser } from "@/lib/supabase/server";
import { DisplayNameForm } from "@/components/settings/display-name-form";
import { messages } from "@/lib/messages";

export default async function ProfilePage() {
  const user = await getRequiredUser();
  const profile = await getUserProfile(user.id);
  const t = messages.account;

  return (
    <PageLayout maxWidth="4xl" padding="relaxed">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.profile}</h1>
          <p className="text-muted-foreground">{t.profileDescription}</p>
        </div>
        <DisplayNameForm initialDisplayName={profile?.full_name || ""} userId={user.id} />
      </div>
    </PageLayout>
  );
}
