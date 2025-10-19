import { create } from 'zustand';
import { User } from '@shared/types';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  updatePoints: (points: number) => void;
  loadUser: () => void;
}

// Load user from localStorage
const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem('caligraph-user');
    if (stored) {
      const user = JSON.parse(stored);
      // Convert date strings back to Date objects
      user.createdAt = new Date(user.createdAt);
      user.updatedAt = new Date(user.updatedAt);
      return user;
    }
  } catch (error) {
    console.error('Error loading user from storage:', error);
  }
  return null;
};

// Save user to localStorage
const saveUserToStorage = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem('caligraph-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('caligraph-user');
    }
  } catch (error) {
    console.error('Error saving user to storage:', error);
  }
};

export const useUserStore = create<UserStore>((set) => ({
  user: loadUserFromStorage(),
  
  setUser: (user) => {
    saveUserToStorage(user);
    set({ user });
  },
  
  updatePoints: (points) =>
    set((state) => {
      if (!state.user) return { user: null };
      
      const updatedUser = { 
        ...state.user, 
        totalPoints: state.user.totalPoints + points,
        updatedAt: new Date(),
      };
      saveUserToStorage(updatedUser);
      return { user: updatedUser };
    }),
    
  loadUser: () => {
    const user = loadUserFromStorage();
    set({ user });
  },
}));

