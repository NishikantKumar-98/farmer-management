import { motion } from 'motion/react';
import { Heart, X, ShoppingCart, TrendingDown } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useWishlist } from '../hooks/useWishlist';
import { mockFarms, Crop } from '../data/farms';

interface WishlistProps {
  onPreOrder: (farm: any, crop: Crop) => void;
}

export function Wishlist({ onPreOrder }: WishlistProps) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const wishlistItems = wishlist
    .map((item) => {
      const farm = mockFarms.find((f) => f.id === item.farmId);
      const crop = farm?.crops.find((c) => c.type === item.cropType);
      return farm && crop ? { farm, crop, addedDate: item.addedDate } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">My Wishlist</h2>
          <p className="text-gray-600 text-sm">
            Crops and farms you're interested in
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <Button variant="outline" onClick={clearWishlist}>
            Clear All
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Items</div>
              <div className="text-2xl">{wishlistItems.length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Unique Farms</div>
              <div className="text-2xl">
                {new Set(wishlistItems.map(i => i.farm.id)).size}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg. Price Drop</div>
              <div className="text-2xl text-green-600">-2%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl mb-2 text-gray-600">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-4">
            Start adding crops you're interested in to track prices and availability
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlistItems.map((item, index) => (
            <motion.div
              key={`${item.farm.id}-${item.crop.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg">{item.crop.type}</h3>
                      <Badge variant="outline" className="text-xs">
                        {item.crop.quality}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.farm.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.farm.location}, {item.farm.state}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(item.farm.id, item.crop.type)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="text-green-600 font-medium">
                      ₹{item.crop.pricePerUnit.toLocaleString()}/{item.crop.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span>{item.crop.quantity} {item.crop.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ready in:</span>
                    <span>{item.crop.availableIn} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Added:</span>
                    <span>{new Date(item.addedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button
                  onClick={() => onPreOrder(item.farm, item.crop)}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Pre-Order Now
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
