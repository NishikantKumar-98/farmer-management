import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, MapPin, Package } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Farm } from '../data/farms';

interface SearchBarProps {
  farms: Farm[];
  onFarmSelect: (farm: Farm) => void;
}

export function SearchBar({ farms, onFarmSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{
    farms: Farm[];
    crops: { farm: Farm; cropType: string }[];
  }>({ farms: [], crops: [] });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ farms: [], crops: [] });
      setIsOpen(false);
      return;
    }

    const searchQuery = query.toLowerCase();

    // Search farms by name, location, or state
    const matchingFarms = farms.filter(
      (farm) =>
        farm.name.toLowerCase().includes(searchQuery) ||
        farm.location.toLowerCase().includes(searchQuery) ||
        farm.state.toLowerCase().includes(searchQuery) ||
        farm.farmerName.toLowerCase().includes(searchQuery)
    );

    // Search by crop type
    const matchingCrops: { farm: Farm; cropType: string }[] = [];
    farms.forEach((farm) => {
      farm.crops.forEach((crop) => {
        if (crop.type.toLowerCase().includes(searchQuery)) {
          matchingCrops.push({ farm, cropType: crop.type });
        }
      });
    });

    setResults({ farms: matchingFarms, crops: matchingCrops });
    setIsOpen(true);
  }, [query, farms]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery('');
    setResults({ farms: [], crops: [] });
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSelect = (farm: Farm) => {
    onFarmSelect(farm);
    setQuery('');
    setIsOpen(false);
  };

  const totalResults = results.farms.length + results.crops.length;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search farms, locations, crops..."
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && totalResults > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {/* Farms Results */}
            {results.farms.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-600">
                  Farms ({results.farms.length})
                </div>
                {results.farms.slice(0, 5).map((farm) => (
                  <button
                    key={farm.id}
                    onClick={() => handleSelect(farm)}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-green-50 transition-colors border-b last:border-b-0 text-left"
                  >
                    <MapPin className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="truncate">{farm.name}</span>
                        {farm.certified && (
                          <Badge className="bg-green-600 text-xs">Certified</Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        {farm.location}, {farm.state}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {farm.crops.length} crop types available
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Crops Results */}
            {results.crops.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-600">
                  Crops ({results.crops.length})
                </div>
                {results.crops.slice(0, 5).map((result, idx) => (
                  <button
                    key={`${result.farm.id}-${result.cropType}-${idx}`}
                    onClick={() => handleSelect(result.farm)}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-green-50 transition-colors border-b last:border-b-0 text-left"
                  >
                    <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{result.cropType}</span>
                        <span className="text-xs text-gray-400">at</span>
                        <span className="truncate text-sm">{result.farm.name}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {result.farm.location}, {result.farm.state}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {totalResults > 10 && (
              <div className="px-4 py-2 bg-gray-50 text-xs text-center text-gray-600">
                Showing top 10 of {totalResults} results
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
