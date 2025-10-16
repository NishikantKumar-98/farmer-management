import { motion } from 'motion/react';
import { 
  MapPin, 
  Award, 
  Star, 
  Phone, 
  Mail,
  Calendar,
  Package,
  TrendingUp,
  Users,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Farm, Crop } from '../data/farms';
import { mockReviews } from '../data/reviews';

interface FarmerProfileProps {
  farm: Farm;
  onPreOrder: (farm: Farm, crop: Crop) => void;
  onClose: () => void;
}

export function FarmerProfile({ farm, onPreOrder, onClose }: FarmerProfileProps) {
  const farmReviews = mockReviews.filter(r => r.farmId === farm.id);
  const avgRating = farmReviews.length > 0
    ? farmReviews.reduce((sum, r) => sum + r.rating, 0) / farmReviews.length
    : farm.rating;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: farmReviews.filter(r => r.rating === rating).length,
    percentage: (farmReviews.filter(r => r.rating === rating).length / Math.max(farmReviews.length, 1)) * 100,
  }));

  return (
    <div className="h-full overflow-y-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white/20"
        >
          ← Back to List
        </Button>
        
        <div className="flex items-start gap-6 flex-wrap">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarFallback className="text-3xl bg-white text-green-600">
              {farm.farmerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl">{farm.name}</h1>
              {farm.certified && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                  <Award className="h-3 w-3 mr-1" />
                  Certified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-green-100 mb-3">
              <MapPin className="h-4 w-4" />
              <span>{farm.location}, {farm.state}</span>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl">{avgRating.toFixed(1)}</span>
                <span className="text-green-100">({farmReviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>{farm.totalOrders} completed orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Response Rate</div>
            <div className="text-2xl">98%</div>
            <Progress value={98} className="h-2 mt-2" />
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">On-Time Delivery</div>
            <div className="text-2xl">95%</div>
            <Progress value={95} className="h-2 mt-2" />
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Crop Varieties</div>
            <div className="text-2xl">{farm.crops.length}</div>
            <div className="text-xs text-gray-500 mt-2">Different crops</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Member Since</div>
            <div className="text-2xl">2022</div>
            <div className="text-xs text-gray-500 mt-2">3 years active</div>
          </Card>
        </div>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="crops">Crops ({farm.crops.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({farmReviews.length})</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="mb-4">Farm Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Farmer Name</div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{farm.farmerName}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Contact Number</div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{farm.farmerContact}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{farm.location}, {farm.state}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Farm Size</div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span>50 acres</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="text-sm text-gray-500 mb-2">About the Farm</div>
                  <p className="text-gray-700">
                    {farm.name} is a {farm.certified ? 'certified organic' : 'traditional'} farm
                    specializing in high-quality crops. With over {farm.totalOrders} successful
                    deliveries, we pride ourselves on quality and timely delivery. Our farm follows
                    sustainable practices and maintains the highest standards of crop quality.
                  </p>
                </div>

                <Separator />

                <div>
                  <div className="text-sm text-gray-500 mb-2">Farming Practices</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Organic Methods</Badge>
                    <Badge variant="outline">Drip Irrigation</Badge>
                    <Badge variant="outline">Natural Fertilizers</Badge>
                    <Badge variant="outline">Integrated Pest Management</Badge>
                    <Badge variant="outline">Sustainable Farming</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="crops" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {farm.crops.map((crop, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl mb-1">{crop.type}</h3>
                        <Badge variant="outline" className="text-xs">
                          {crop.quality}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => onPreOrder(farm, crop)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Pre-Order
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available Quantity:</span>
                        <span>{crop.quantity} {crop.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per {crop.unit}:</span>
                        <span className="text-green-600">₹{crop.pricePerUnit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available In:</span>
                        <span>{crop.availableIn} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Date:</span>
                        <span>{crop.forecastDate}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-4">
            {/* Rating Summary */}
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-2">{avgRating.toFixed(1)}</div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(avgRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">{farmReviews.length} reviews</div>
                </div>

                <div className="space-y-2">
                  {ratingDistribution.map((dist) => (
                    <div key={dist.rating} className="flex items-center gap-3">
                      <div className="text-sm w-12">{dist.rating} star</div>
                      <Progress value={dist.percentage} className="flex-1 h-2" />
                      <div className="text-sm text-gray-600 w-12">{dist.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Reviews List */}
            {farmReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {review.buyerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{review.buyerName}</span>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {review.cropType}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <ThumbsUp className="h-3 w-3" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {farmReviews.length === 0 && (
              <Card className="p-12 text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl mb-2 text-gray-600">No Reviews Yet</h3>
                <p className="text-gray-500">Be the first to review this farm!</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="certifications" className="mt-6">
            <Card className="p-6">
              <h3 className="mb-4">Certifications & Compliance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {farm.certifications.map((cert, index) => (
                  <motion.div
                    key={cert}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 border rounded-lg"
                  >
                    <Award className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="mb-1">{cert}</div>
                      <div className="text-sm text-gray-500">Valid until Dec 2026</div>
                      <Badge variant="outline" className="mt-2 text-xs">Verified</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>

              {farm.certifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No certifications available
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
