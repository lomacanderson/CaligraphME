import { create } from 'zustand';
import { User } from '@shared/types';
import { supabase } from '@/services/supabase.client';
import { userApi } from '@/services/api/user.api';

interface UserStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updatePoints: (points: number) => void;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
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

export const useUserStore = create<UserStore>((set, get) => ({
  user: loadUserFromStorage(),
  isLoading: false,
  isAuthenticated: false,
  
  setUser: (user) => {
    saveUserToStorage(user);
    set({ user, isAuthenticated: !!user });
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
    
  loadUser: async () => {
    // Try loading from localStorage first
    const storedUser = loadUserFromStorage();
    if (storedUser) {
      set({ user: storedUser, isAuthenticated: true });
      return;
    }

    // If no stored user, check Supabase session
    if (!supabase) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch user profile from backend
        const userProfile = await userApi.getUserById(session.user.id);
        saveUserToStorage(userProfile);
        set({ user: userProfile, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      set({ user: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    saveUserToStorage(null);
    set({ user: null, isAuthenticated: false });
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    await get().loadUser();
    set({ isLoading: false });

    // Listen for auth state changes
    if (supabase) {
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const userProfile = await userApi.getUserById(session.user.id);
            saveUserToStorage(userProfile);
            set({ user: userProfile, isAuthenticated: true });
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          saveUserToStorage(null);
          set({ user: null, isAuthenticated: false });
        }
      });
    }
  },
}));

