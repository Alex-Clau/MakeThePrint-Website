import { PageLayout } from "@/components/layout/page-layout";
import { getUserProfile } from "@/lib/supabase/user-profiles";
import { getRequiredUser } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/settings/profile-form";

async function SettingsContent() {
  const user = await getRequiredUser();
  const profile = await getUserProfile(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <ProfileForm
        initialData={{
          email: user.email || "",
          full_name: profile?.full_name || "",
          phone: profile?.phone || "",
        }}
        userId={user.id}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <PageLayout maxWidth="4xl" padding="relaxed">
      <SettingsContent />
    </PageLayout>
  );
}

