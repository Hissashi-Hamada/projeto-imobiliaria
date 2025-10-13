import { useEffect, useState, useCallback } from 'react';
import * as auth from '@/services/auth';

// Small client-side auth hook to fetch current user and expose role/isAdmin
export default function useAuth() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      const data = await auth.me();
      // Expecting backend to return user object with 'is_admin' or 'role' field
      setUser(data || null);
    } catch (e) {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try { await auth.logout(); } catch (e) { /* ignore */ }
    setUser(null);
    // clear localStorage immediately so other legacy code doesn't read stale user
    if (typeof window !== 'undefined') {
      try { window.localStorage.removeItem('user'); } catch (_) {}
      // dispatch global event so other hook instances can react
      try { window.dispatchEvent(new CustomEvent('app:logout')); } catch (_) {}
    }
  }, []);

  // Listen for global logout events so multiple hook instances clear state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onGlobalLogout = () => {
      setUser(null);
      setAuthChecked(true);
    };
    window.addEventListener('app:logout', onGlobalLogout);
    return () => window.removeEventListener('app:logout', onGlobalLogout);
  }, []);

  const isAuthenticated = !!user;
  // Derive isAdmin if backend includes a flag (is_admin) or role === 'admin'
  const isAdmin = user ? (user.is_admin === true || user.role === 'admin') : null;

  // keep localStorage in sync so legacy code that reads it isn't completely stale
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (user) {
        window.localStorage.setItem('user', JSON.stringify(user));
      } else {
        window.localStorage.removeItem('user');
      }
    } catch (_) {}
  }, [user]);

  return { user, isAuthenticated, isAdmin, authChecked, fetchMe, logout };
}
