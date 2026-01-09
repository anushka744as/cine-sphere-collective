import { useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getUserRole } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const applySession = (nextSession: Session | null) => {
      if (!mountedRef.current) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    };

    const fetchAndSetRole = (userId: string) => {
      // Defer ALL backend calls to avoid auth state change deadlocks.
      setTimeout(async () => {
        if (!mountedRef.current) return;
        try {
          const { role } = await getUserRole(userId);
          if (!mountedRef.current) return;
          setUserRole(role || "user");
        } catch {
          if (!mountedRef.current) return;
          setUserRole("user");
        } finally {
          if (mountedRef.current) setLoading(false);
        }
      }, 0);
    };

    // 1) Subscribe first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      applySession(nextSession);

      if (nextSession?.user) {
        setLoading(true);
        fetchAndSetRole(nextSession.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    // 2) Then read initial session
    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session);
      if (data.session?.user) {
        fetchAndSetRole(data.session.user.id);
      } else {
        if (mountedRef.current) setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = userRole === "admin";

  return { user, session, userRole, isAdmin, loading };
}
