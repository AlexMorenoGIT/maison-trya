"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface SiteSettingsContextValue {
  settings: Record<string, string>;
  get: (key: string, fallback: string) => string;
  update: (key: string, value: string) => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: {},
  get: (_key, fallback) => fallback,
  update: async () => {},
});

interface SiteSettingsProviderProps {
  children: React.ReactNode;
  initial: Record<string, string>;
}

export function SiteSettingsProvider({ children, initial }: SiteSettingsProviderProps) {
  const [settings, setSettings] = useState<Record<string, string>>(initial);

  const get = useCallback(
    (key: string, fallback: string) => {
      const val = settings[key];
      return val !== undefined && val !== "" ? val : fallback;
    },
    [settings]
  );

  const update = useCallback(async (key: string, value: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });

    if (error) throw new Error(error.message);
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, get, update }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
