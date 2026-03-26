import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

/**
 * Custom hook for authentication state management
 * @returns {{session: Object|null, user: Object|null, loading: boolean}}
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    authService.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session || null);
      setUser(data.session?.user || null);
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: listener } = authService.onAuthStateChange((_, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading };
}

export default useAuth;
