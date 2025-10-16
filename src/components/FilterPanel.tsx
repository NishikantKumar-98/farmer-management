import { motion } from 'motion/react';
import { Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { CROP_TYPES, STATES } from '../data/farms';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    certifiedOnly: boolean;
    cropTypes: string[];
    states: string[];
    priceRange: [number, number];
    availabilityDays: number;
  };
  onFilterChange: (filters: any) => void;
}

export function FilterPanel({ isOpen, onClose, filters, onFilterChange }: FilterPanelProps) {
  const handleCropToggle = (crop: string) => {
    const newCrops = filters.cropTypes.includes(crop)
      ? filters.cropTypes.filter((c) => c !== crop)
      : [...filters.cropTypes, crop];
    onFilterChange({ ...filters, cropTypes: newCrops });
  };

  const handleStateToggle = (state: string) => {
    const newStates = filters.states.includes(state)
      ? filters.states.filter((s) => s !== state)
      : [...filters.states, state];
    onFilterChange({ ...filters, states: newStates });
  };

  const clearFilters = () => {
    onFilterChange({
      certifiedOnly: false,
      cropTypes: [],
      states: [],
      priceRange: [0, 100000],
      availabilityDays: 60,
    });
  };

  const activeFiltersCount = 
    (filters.certifiedOnly ? 1 : 0) + 
    filters.cropTypes.length + 
    filters.states.length;

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        exit={{ x: -320 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-green-600" />
            <h2>Filters</h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Certified Only */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Checkbox
                checked={filters.certifiedOnly}
                onCheckedChange={(checked) =>
                  onFilterChange({ ...filters, certifiedOnly: checked })
                }
              />
              <span>Certified Farms Only</span>
            </Label>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <Label>Available Within (Days)</Label>
            <div className="px-2">
              <Slider
                value={[filters.availabilityDays]}
                onValueChange={([value]) =>
                  onFilterChange({ ...filters, availabilityDays: value })
                }
                min={1}
                max={60}
                step={1}
              />
              <div className="text-sm text-gray-600 mt-2">{filters.availabilityDays} days</div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label>Price Range (₹/ton)</Label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  onFilterChange({ ...filters, priceRange: value as [number, number] })
                }
                min={0}
                max={100000}
                step={1000}
              />
              <div className="text-sm text-gray-600 mt-2">
                ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
              </div>
            </div>
          </div>

          {/* Crop Types */}
          <div className="space-y-3">
            <Label>Crop Types</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {CROP_TYPES.map((crop) => (
                <Label key={crop} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.cropTypes.includes(crop)}
                    onCheckedChange={() => handleCropToggle(crop)}
                  />
                  <span>{crop}</span>
                </Label>
              ))}
            </div>
          </div>

          {/* States */}
          <div className="space-y-3">
            <Label>States</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {STATES.map((state) => (
                <Label key={state} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.states.includes(state)}
                    onCheckedChange={() => handleStateToggle(state)}
                  />
                  <span>{state}</span>
                </Label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button variant="outline" className="w-full" onClick={clearFilters}>
              Clear All Filters
            </Button>
          )}
        </div>
      </motion.div>
    </>
  );
}
