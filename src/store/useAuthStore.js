import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: {
        id: null,
        email: null,
        role: null,
      },
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      clearUser: () =>
        set({
          user: { id: null, email: null, role: null },
        }),
    }),
    {
      name: 'auth-storage', // Key in localStorage
    }
  )
);

export default useAuthStore;
