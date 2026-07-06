import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type { SkiResort } from '../types';
import { fetchResortList } from '../api/weatherApi';

interface ResortContextType {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProvince: string | null;
  setSelectedProvince: (p: string | null) => void;
  filteredResorts: SkiResort[];
  resorts: SkiResort[];
  provinces: string[];
  loading: boolean;
}

const ResortContext = createContext<ResortContextType | null>(null);

export function ResortProvider({ children }: { children: ReactNode }) {
  const [resorts, setResorts] = useState<SkiResort[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  useEffect(() => {
    fetchResortList().then((data) => {
      setResorts(data);
      setLoading(false);
    });
  }, []);

  const filteredResorts = useMemo(() => {
    let result = resorts;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.name.includes(q) ||
          r.nameEn.toLowerCase().includes(q) ||
          r.province.includes(q),
      );
    }

    if (selectedProvince) {
      result = result.filter((r) => r.province === selectedProvince);
    }

    return result;
  }, [resorts, searchQuery, selectedProvince]);

  const provinces = useMemo(() => {
    return [...new Set(resorts.map((r) => r.province))].sort();
  }, [resorts]);

  return (
    <ResortContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedProvince,
        setSelectedProvince,
        filteredResorts,
        resorts,
        provinces,
        loading,
      }}
    >
      {children}
    </ResortContext.Provider>
  );
}

export function useResortContext() {
  const ctx = useContext(ResortContext);
  if (!ctx) {
    throw new Error('useResortContext must be used within ResortProvider');
  }
  return ctx;
}
