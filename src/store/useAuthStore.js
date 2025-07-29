// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// const useAuthStore = create(
//   persist(
//     (set) => ({
//       user: {
//         id: null,
//         email: null,
//         role: null,
//         name: null,
//         profileImage: null,
//         phone: null,
//         address: null,
//       },
//       isLoading: true,
//       setUser: (user) => set({ user }),
//       setLoading: (loading) => set({ isLoading: loading }),
//       updateProfile: (profileData) =>
//         set((state) => ({
//           user: { ...state.user, ...profileData },
//         })),
//       clearUser: () =>
//         set({
//           user: {
//             id: null,
//             email: null,
//             role: null,
//             name: null,
//             profileImage: null,
//             phone: null,
//             address: null,
//           },
//         }),
//     }),
//     {
//       name: 'auth-storage',
//     }
//   )
// );

// export default useAuthStore;