import axios from "axios";

const API_URL = "http://localhost:3000";

type Session = {
  access_token: string;
};

type AuthChangeCallback = (
  event: string,
  session: Session | null
) => void;

export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: any) => {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const session = {
        access_token: res.data.accessToken,
      };

      localStorage.setItem("token", session.access_token);

      return {
        data: {
          session,
          user: { email },
        },
        error: null,
      };
    },

    signUp: async ({ email, password }: any) => {
      await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });

      return {
        data: {
          user: { email },
        },
        error: null,
      };
    },

    signOut: async () => {
      localStorage.removeItem("token");
      return { error: null };
    },

    // ✅ REQUIRED BY AuthContext
    getSession: async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return { data: { session: null }, error: null };
      }

      return {
        data: {
          session: { access_token: token },
        },
        error: null,
      };
    },

    // ✅ REQUIRED BY AuthContext
    onAuthStateChange: (callback: AuthChangeCallback) => {
      const token = localStorage.getItem("token");

      if (token) {
        callback("SIGNED_IN", { access_token: token });
      } else {
        callback("SIGNED_OUT", null);
      }

      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      };
    },
  },
};
