import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useSupabaseSession() {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        supabase.auth.getSession().then(({ data }) => {
            if (!isMounted) return;
            setSession(data.session || null);
            setUser(data.session?.user || null);
            setLoading(false);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_, newSession) => {
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

export default useSupabaseSession;
