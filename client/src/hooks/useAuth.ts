import { useMutation } from "@tanstack/react-query";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: any;
  token?: string;
  session?: any;
}

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginData>({
    mutationFn: async (credentials) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      
      if (data.session) {
        const session = data.session;

        
        const { supabase } = await import("../lib/supabase");
        const { error } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });

        if (error) throw new Error(`Session setup failed: ${error.message}`);

        return {
          user: session.user,
          session,
          token: session.access_token,
        };
      }

      
      return {
        user: data.user,
        token: data.token,
        session: data.session,
      };
    },

    retry: false,
    networkMode: "online",
  });
};

export const useSignup = () => {
  return useMutation<AuthResponse, Error, SignupData>({
    mutationFn: async (userData) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

     
      if (data.session) {
        const session = data.session;

        const { supabase } = await import("../lib/supabase");
        const { error } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });

        if (error) throw new Error(`Session setup failed: ${error.message}`);

        return {
          user: session.user,
          session,
          token: session.access_token,
        };
      }

   
      return {
        user: data.user,
        token: data.token,
        session: data.session,
      };
    },

    retry: false,
    networkMode: "online",
  });
};



