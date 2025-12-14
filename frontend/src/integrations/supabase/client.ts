import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: any) => {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      return {
        data: {
          session: {
            access_token: res.data.accessToken,
          },
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
        data: { user: { email } },
        error: null,
      };
    },

    signOut: async () => {
      localStorage.removeItem('token');
      return { error: null };
    },
  },
};
