import { supabase } from './supabase.client';
import { userApi } from './api/user.api';

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  nativeLanguage: string;
  targetLanguage: string;
  level: string;
  age?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(data: SignUpData) {
    if (!supabase) {
      throw new Error('Authentication is not configured. Please set up Supabase credentials in your .env file.');
    }

    // 1. Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // 2. Create user profile in our database via backend API
    try {
      const userProfile = await userApi.createUser({
        id: authData.user.id,
        email: data.email,
        username: data.username,
        nativeLanguage: data.nativeLanguage,
        targetLanguage: data.targetLanguage,
        level: data.level,
        age: data.age,
      });

      return { user: authData.user, profile: userProfile };
    } catch (error) {
      // If profile creation fails, we should clean up the auth user
      console.error('Failed to create user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  /**
   * Log in an existing user
   */
  static async login(data: LoginData) {
    if (!supabase) {
      throw new Error('Authentication is not configured. Please set up Supabase credentials in your .env file.');
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;
    if (!authData.user) throw new Error('Login failed');

    // Fetch user profile from backend
    const userProfile = await userApi.getUserById(authData.user.id);

    return { user: authData.user, profile: userProfile };
  }

  /**
   * Log out the current user
   */
  static async logout() {
    if (!supabase) {
      throw new Error('Authentication is not configured. Please set up Supabase credentials in your .env file.');
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Get the current session
   */
  static async getSession() {
    if (!supabase) {
      return null;
    }

    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    if (!supabase) {
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string) {
    if (!supabase) {
      throw new Error('Authentication is not configured. Please set up Supabase credentials in your .env file.');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  }

  /**
   * Update password
   */
  static async updatePassword(newPassword: string) {
    if (!supabase) {
      throw new Error('Authentication is not configured. Please set up Supabase credentials in your .env file.');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  }
}

