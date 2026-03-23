import { createClient } from "@/lib/supabase/server";
import HomepageVideoForm from "./HomepageVideoForm";

export default async function AdminHomepagePage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("key", "hero_video_url")
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-widest text-tortoise mb-8">
        HOMEPAGE
      </h1>
      <HomepageVideoForm currentVideoUrl={data?.value ?? ""} />
    </div>
  );
}
