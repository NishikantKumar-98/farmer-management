import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Farm } from '../data/farms';
import { fetchJSON } from '../lib/api';

type FarmsContextValue = {
  farms: Farm[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

const FarmsContext = createContext<FarmsContextValue | undefined>(undefined);

export const FarmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJSON<Farm[]>('/api/farms');
      setFarms(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch farms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <FarmsContext.Provider value={{ farms, loading, error, reload: load }}>
      {children}
    </FarmsContext.Provider>
  );
};

export function useFarms() {
  const ctx = useContext(FarmsContext);
  if (!ctx) throw new Error('useFarms must be used within FarmsProvider');
  return ctx;
}
