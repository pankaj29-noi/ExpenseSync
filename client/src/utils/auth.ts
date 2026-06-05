import { supabase } from '../lib/supabase';

export const handleGoogleLogin = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dash`, // yeh new version ke hisab se supabase ke
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        scopes: "email profile openid",
      },
    });

    if (error) throw error;

  } catch (err) {
    throw err;
  }
};
