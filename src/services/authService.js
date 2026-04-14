import { supabase } from '../api/supabase';

/**
 * Authentication service
 * Handles all authentication-related operations
 */
export const authService = {
  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async signIn(email, password) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  /**
   * Sign up new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} displayName - User display name
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async signUp(email, password, displayName) {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: { displayName } }
    });
  },

  /**
   * Sign out current user
   * @returns {Promise<{error: Error|null}>}
   */
  async signOut() {
    return await supabase.auth.signOut();
  },

  /**
   * Get current user
   * @returns {Promise<{data: {user: Object|null}, error: Error|null}>}
   */
  async getCurrentUser() {
    return await supabase.auth.getUser();
  },

  /**
   * Get current session
   * @returns {Promise<{data: {session: Object|null}, error: Error|null}>}
   */
  async getSession() {
    return await supabase.auth.getSession();
  },

  /**
   * Subscribe to auth state changes
   * @param {Function} callback - Callback function for auth state changes
   * @returns {Object} Subscription object with unsubscribe method
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async resetPassword(email) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  /**
   * Update password for an authenticated user (or after recovery)
   * @param {string} newPassword - New password
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updatePassword(newPassword) {
    return await supabase.auth.updateUser({ password: newPassword });
  }
};
