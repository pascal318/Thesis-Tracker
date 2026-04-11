import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/client.js';

export function useAuth() {
  const [google, setGoogle] = useState({ connected: false, configured: false });
  const [loading, setLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    try {
      const status = await authApi.googleStatus();
      setGoogle(status);
    } catch {
      // Server not available — integrations won't work
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkStatus(); }, [checkStatus]);

  // Check for auth redirect callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth')) {
      window.history.replaceState({}, '', '/');
      checkStatus();
    }
  }, [checkStatus]);

  async function disconnectGoogle() {
    await authApi.googleDisconnect();
    setGoogle({ connected: false, configured: google.configured });
  }

  return { google, loading, disconnectGoogle, refresh: checkStatus };
}
