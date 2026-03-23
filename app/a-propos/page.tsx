import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { SiteSettingsProvider } from "@/lib/site-settings-context";
import AProposContent from "./AProposContent";

export default async function APropos() {
  const supabase = await createClient();

  const { data } = await supabase.from("site_settings").select("key, value");
  const settings: Record<string, string> = {};
  for (const row of data || []) {
    settings[row.key] = row.value;
  }

  return (
    <SiteSettingsProvider initial={settings}>
      <Header />
      <AProposContent />
      <Footer />
    </SiteSettingsProvider>
  );
}
