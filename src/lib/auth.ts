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
  // First try to get role from user_roles table (preferred method)
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (roleData?.role) {
    console.log("Auth: Found role in user_roles table:", roleData.role);
    return { role: roleData.role as string, error: null };
  }

  // Fallback: check profiles table for role field (using type assertion since column may not be in types)
  const { data: profileData, error: profileError } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  
  if (profileData?.role) {
    console.log("Auth: Found role in profiles table:", profileData.role);
    return { role: profileData.role as string, error: null };
  }

  // Default to 'user' if no role found
  console.log("Auth: No role found, defaulting to 'user'");
  return { role: 'user', error: roleError || profileError };
};
