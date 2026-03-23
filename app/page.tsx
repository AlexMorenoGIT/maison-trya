import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { SiteSettingsProvider } from "@/lib/site-settings-context";
import HomeHero from "./HomeHero";
import HomeContent from "./HomeContent";

export default async function Home() {
  const supabase = await createClient();

  const [productsResult, settingsResult] = await Promise.all([
    supabase.from("products").select("*").eq("is_featured", true).limit(6),
    supabase.from("site_settings").select("key, value"),
  ]);

  const featuredProducts: Product[] = productsResult.data || [];
  const settings: Record<string, string> = {};
  for (const row of settingsResult.data || []) {
    settings[row.key] = row.value;
  }

  const heroVideoUrl = settings["hero_video_url"] || "";

  return (
    <SiteSettingsProvider initial={settings}>
      <Header />

      {/* -- Section 1: Hero ------------------------------------------------- */}
      <HomeHero videoUrl={heroVideoUrl} />

      {/* -- Sections 2-5 with editable content ------------------------------ */}
      <HomeContent featuredProducts={featuredProducts} />

      <Footer />
    </SiteSettingsProvider>
  );
}
