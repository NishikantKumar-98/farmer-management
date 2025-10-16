import { motion } from 'motion/react';
import { X, Award, Star, Phone, MapPin, Package, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Farm } from '../data/farms';

interface CompareFarmsProps {
  farms: Farm[];
  onRemove: (farmId: string) => void;
  onClear: () => void;
}

export function CompareFarms({ farms, onRemove, onClear }: CompareFarmsProps) {
  if (farms.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Package className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl mb-2">No Farms to Compare</h3>
        <p className="text-gray-600">
          Select farms from the list to compare them side by side
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl">Compare Farms ({farms.length})</h2>
        <Button variant="outline" onClick={onClear}>
          Clear All
        </Button>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {farms.map((farm, index) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-80"
            >
              <Card className="border-2 h-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b relative">
                  <button
                    onClick={() => onRemove(farm.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-white/50 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex items-start gap-2 mb-3">
                    <h3 className="flex-1 pr-6">{farm.name}</h3>
                    {farm.certified && (
                      <Badge className="bg-green-600 flex-shrink-0">
                        <Award className="h-3 w-3 mr-1" />
                        Certified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{farm.location}, {farm.state}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{farm.rating}</span>
                    </div>
                    <div className="text-gray-600">{farm.totalOrders} orders</div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-4">
                  {/* Farmer Info */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Farmer Details</div>
                    <div className="text-sm">
                      <div>{farm.farmerName}</div>
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{farm.farmerContact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Certifications</div>
                    <div className="flex flex-wrap gap-1">
                      {farm.certifications.map((cert) => (
                        <Badge key={cert} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Crops */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2">
                      Available Crops ({farm.crops.length})
                    </div>
                    <div className="space-y-2">
                      {farm.crops.map((crop, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded p-2 text-sm border"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span>{crop.type}</span>
                            <Badge variant="outline" className="text-xs">
                              {crop.quality}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Quantity:</span>
                              <span>{crop.quantity} {crop.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Price:</span>
                              <span className="text-green-600">
                                ₹{crop.pricePerUnit.toLocaleString()}/{crop.unit}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Available:</span>
                              <span>{crop.availableIn} days</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comparison Metrics */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Key Metrics</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Crops:</span>
                        <span>{farm.crops.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Price:</span>
                        <span className="text-green-600">
                          ₹
                          {(
                            farm.crops.reduce((sum, c) => sum + c.pricePerUnit, 0) /
                            farm.crops.length
                          ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Earliest Available:</span>
                        <span>
                          {Math.min(...farm.crops.map((c) => c.availableIn))} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Quantity:</span>
                        <span>
                          {farm.crops.reduce((sum, c) => sum + c.quantity, 0)} tons
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
