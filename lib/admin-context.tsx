"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/supabase/admin";

interface AdminContextValue {
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextValue>({ isAdmin: false });

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAdmin(isAdminEmail(user?.email ?? undefined));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(isAdminEmail(session?.user?.email ?? undefined));
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
