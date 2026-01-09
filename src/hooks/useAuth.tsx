import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getUserRole } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchRole = async (userId: string) => {
      console.log("Auth: Fetching role for", userId);
      try {
        const { role, error } = await getUserRole(userId);
        if (!mounted) return;

        if (error) {
          console.error("Auth: Error fetching user role:", error);
          setUserRole('user');
        } else {
          console.log("Auth: Role fetched successfully:", role);
          setUserRole(role || 'user');
        }
      } catch (err) {
        console.error("Auth: Unexpected error fetching role:", err);
        if (mounted) setUserRole('user');
      } finally {
        if (mounted) {
          setLoading(false);
          console.log("Auth: Loading finished (authenticated)");
        }
      }
    };

    // Initial session check
    const checkInitialSession = async () => {
      console.log("Auth: Checking initial session");
      const { data: { session }, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("Auth: Session check error:", error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setSession(session);
        setUser(session.user);
        await fetchRole(session.user.id);
      } else {
        console.log("Auth: No initial session found");
        setLoading(false);
      }
    };

    checkInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);

        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // If we already have a role and the user hasn't changed, don't set loading to true
          // to avoid flickering or getting stuck.
          if (!userRole) {
            setLoading(true);
          }
          await fetchRole(currentSession.user.id);
        } else {
          setUserRole(null);
          setLoading(false);
          console.log("Auth: Loading finished (unauthenticated)");
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Only run once on mount

  const isAdmin = userRole === 'admin';

  return { user, session, userRole, isAdmin, loading };
}
