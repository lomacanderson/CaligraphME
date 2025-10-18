import { create } from 'zustand';
import { User } from '@shared/types';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  updatePoints: (points: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updatePoints: (points) =>
    set((state) => ({
      user: state.user ? { ...state.user, totalPoints: state.user.totalPoints + points } : null,
    })),
}));

