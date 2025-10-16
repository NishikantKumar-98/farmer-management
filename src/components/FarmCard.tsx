import { motion } from 'motion/react';
import { MapPin, Award, Star, Phone, Calendar, Package, TrendingUp, Heart, GitCompare, Bookmark } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Farm, Crop } from '../data/farms';
import { useWishlist } from '../hooks/useWishlist';
import { toast } from 'sonner@2.0.3';

interface FarmCardProps {
  farm: Farm;
  onPreOrder: (farm: Farm, crop: Crop) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (farmId: string) => void;
  isComparing?: boolean;
  onToggleCompare?: (farmId: string) => void;
}

export function FarmCard({ 
  farm, 
  onPreOrder, 
  isFavorite = false,
  onToggleFavorite,
  isComparing = false,
  onToggleCompare,
}: FarmCardProps) {
  const { addToWishlist, isInWishlist } = useWishlist();

  const handleAddToWishlist = (crop: Crop) => {
    const added = addToWishlist(farm.id, crop.type);
    if (added) {
      toast.success(`${crop.type} added to wishlist`);
    } else {
      toast.info(`${crop.type} is already in your wishlist`);
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Premium':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Organic':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl">{farm.name}</h3>
                {farm.certified && (
                  <Badge className="bg-green-600 hover:bg-green-700">
                    <Award className="h-3 w-3 mr-1" />
                    Certified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{farm.location}, {farm.state}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{farm.rating}</span>
              </div>
              <div className="text-xs text-gray-500">{farm.totalOrders} orders</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {onToggleFavorite && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleFavorite(farm.id)}
                className={`gap-1 ${isFavorite ? 'text-red-600 border-red-300 bg-red-50' : ''}`}
              >
                <Heart className={`h-3 w-3 ${isFavorite ? 'fill-red-600' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
            )}
            {onToggleCompare && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleCompare(farm.id)}
                className={`gap-1 ${isComparing ? 'text-blue-600 border-blue-300 bg-blue-50' : ''}`}
              >
                <GitCompare className="h-3 w-3" />
                {isComparing ? 'Comparing' : 'Compare'}
              </Button>
            )}
          </div>

          {/* Farmer Info */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-sm">
              <div className="text-gray-700">Farmer: <span>{farm.farmerName}</span></div>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Phone className="h-3 w-3" />
                <span>{farm.farmerContact}</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {farm.certifications.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {farm.certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Crops */}
        <div className="p-4">
          <h4 className="text-sm text-gray-600 mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Available Crops
          </h4>
          <div className="space-y-3">
            {farm.crops.map((crop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-3 border"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{crop.type}</span>
                      <Badge variant="outline" className={getQualityColor(crop.quality)}>
                        {crop.quality}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>{crop.quantity} {crop.unit}</div>
                      <div className="text-green-600">₹{crop.pricePerUnit.toLocaleString()}/{crop.unit}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToWishlist(crop)}
                      className={isInWishlist(farm.id, crop.type) ? 'text-red-600' : ''}
                    >
                      <Bookmark className={`h-4 w-4 ${isInWishlist(farm.id, crop.type) ? 'fill-red-600' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onPreOrder(farm, crop)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Pre-Order
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Available in {crop.availableIn} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>By {crop.forecastDate}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
