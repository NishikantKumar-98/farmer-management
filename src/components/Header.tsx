import { Sprout, MapPin, ShoppingCart, Award } from 'lucide-react';
import { Badge } from './ui/badge';

interface HeaderProps {
  totalFarms: number;
  certifiedFarms: number;
  availableCrops: number;
}

export function Header({ totalFarms, certifiedFarms, availableCrops }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Sprout className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl">AgriConnect</h1>
              <p className="text-green-100 text-sm">Transparent Farm-to-Buyer Marketplace</p>
            </div>
          </div>
          
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <MapPin className="h-5 w-5" />
              <div>
                <div className="text-xs text-green-100">Total Farms</div>
                <div className="text-xl">{totalFarms}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Award className="h-5 w-5" />
              <div>
                <div className="text-xs text-green-100">Certified</div>
                <div className="text-xl">{certifiedFarms}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <ShoppingCart className="h-5 w-5" />
              <div>
                <div className="text-xs text-green-100">Crop Types</div>
                <div className="text-xl">{availableCrops}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
