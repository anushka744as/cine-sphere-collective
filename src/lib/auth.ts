import { supabase } from "@/integrations/supabase/client";

export const signUp = async (email: string, password: string) => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl
    }
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getUserRole = async (userId: string) => {
  // Preferred: use backend function to avoid client-side role assumptions
  // Returns true if the user has the 'admin' role.
  try {
    const { data: isAdmin, error } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (error) {
      console.error("Auth: role check failed:", error);
      return { role: "user", error };
    }

    return { role: isAdmin ? "admin" : "user", error: null };
  } catch (err) {
    console.error("Auth: role check unexpected error:", err);
    return { role: "user", error: err };
  }
};
