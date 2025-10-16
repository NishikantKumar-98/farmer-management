import { motion } from 'motion/react';
import { Calendar, TrendingUp, TrendingDown, Leaf, Sun, Cloud, Droplets } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const monthlyData = [
  { month: 'Oct', inSeason: ['Wheat', 'Rice', 'Cotton'], price: 'stable', weather: 'Favorable' },
  { month: 'Nov', inSeason: ['Wheat', 'Onions', 'Potatoes'], price: 'rising', weather: 'Cool' },
  { month: 'Dec', inSeason: ['Wheat', 'Tomatoes', 'Chilies'], price: 'stable', weather: 'Cold' },
  { month: 'Jan', inSeason: ['Wheat', 'Peas', 'Mustard'], price: 'rising', weather: 'Cold' },
  { month: 'Feb', inSeason: ['Wheat', 'Barley', 'Gram'], price: 'stable', weather: 'Moderate' },
  { month: 'Mar', inSeason: ['Mangoes', 'Watermelon'], price: 'falling', weather: 'Warm' },
];

const cropSeasons = [
  {
    name: 'Wheat',
    season: 'Rabi (Winter)',
    plantingMonths: 'Oct-Dec',
    harvestMonths: 'Mar-May',
    peakAvailability: 'April',
    currentStatus: 'In Season',
    priceOutlook: 'Stable',
  },
  {
    name: 'Rice',
    season: 'Kharif (Monsoon)',
    plantingMonths: 'Jun-Aug',
    harvestMonths: 'Oct-Dec',
    peakAvailability: 'November',
    currentStatus: 'Peak Season',
    priceOutlook: 'Decreasing',
  },
  {
    name: 'Cotton',
    season: 'Kharif (Monsoon)',
    plantingMonths: 'May-Jul',
    harvestMonths: 'Oct-Jan',
    peakAvailability: 'December',
    currentStatus: 'In Season',
    priceOutlook: 'Stable',
  },
  {
    name: 'Mangoes',
    season: 'Summer',
    plantingMonths: 'Year-round',
    harvestMonths: 'Mar-Jun',
    peakAvailability: 'May',
    currentStatus: 'Off Season',
    priceOutlook: 'High',
  },
  {
    name: 'Onions',
    season: 'Rabi (Winter)',
    plantingMonths: 'Oct-Nov',
    harvestMonths: 'Feb-Apr',
    peakAvailability: 'March',
    currentStatus: 'Growing',
    priceOutlook: 'Rising',
  },
  {
    name: 'Tomatoes',
    season: 'Year-round',
    plantingMonths: 'Multiple',
    harvestMonths: 'Multiple',
    peakAvailability: 'Oct-Mar',
    currentStatus: 'In Season',
    priceOutlook: 'Stable',
  },
];

const weatherImpact = [
  {
    region: 'North India',
    icon: Sun,
    condition: 'Clear',
    impact: 'Favorable for wheat harvesting',
    cropsFavorable: ['Wheat', 'Mustard', 'Barley'],
  },
  {
    region: 'South India',
    icon: Cloud,
    condition: 'Partly Cloudy',
    impact: 'Good for rice cultivation',
    cropsFavorable: ['Rice', 'Sugarcane'],
  },
  {
    region: 'West India',
    icon: Droplets,
    condition: 'Light Rain',
    impact: 'Beneficial for cotton growth',
    cropsFavorable: ['Cotton', 'Groundnut'],
  },
  {
    region: 'East India',
    icon: Sun,
    condition: 'Sunny',
    impact: 'Ideal for vegetable farming',
    cropsFavorable: ['Tomatoes', 'Potatoes', 'Onions'],
  },
];

export function SeasonalInsights() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Seasonal Insights</h2>
        <p className="text-gray-600 text-sm">
          Crop availability, weather impacts, and seasonal trends
        </p>
      </div>

      {/* Current Season Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-2 border-green-200 bg-green-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-600 rounded-lg text-white">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Current Season</div>
              <div className="text-xl">Rabi (Winter)</div>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Peak time for wheat, barley, and winter vegetables
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-600 rounded-lg text-white">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Crops In Season</div>
              <div className="text-xl">12 Types</div>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Highest availability and competitive prices
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-600 rounded-lg text-white">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Price Trend</div>
              <div className="text-xl">Stable</div>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Good time to place bulk orders
          </p>
        </Card>
      </div>

      <Tabs defaultValue="crops" className="w-full">
        <TabsList>
          <TabsTrigger value="crops">Crop Calendar</TabsTrigger>
          <TabsTrigger value="weather">Weather Impact</TabsTrigger>
          <TabsTrigger value="forecast">Monthly Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="crops" className="mt-6 space-y-4">
          {cropSeasons.map((crop, index) => (
            <motion.div
              key={crop.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl">{crop.name}</h3>
                      <Badge
                        className={
                          crop.currentStatus === 'Peak Season' || crop.currentStatus === 'In Season'
                            ? 'bg-green-600'
                            : crop.currentStatus === 'Growing'
                            ? 'bg-blue-600'
                            : 'bg-gray-600'
                        }
                      >
                        {crop.currentStatus}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{crop.season}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {crop.priceOutlook === 'Rising' ? (
                      <TrendingUp className="h-5 w-5 text-red-600" />
                    ) : crop.priceOutlook === 'Decreasing' ? (
                      <TrendingDown className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-gray-600" />
                    )}
                    <span className="text-sm">{crop.priceOutlook} Prices</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Planting Period</div>
                    <div>{crop.plantingMonths}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Harvest Period</div>
                    <div>{crop.harvestMonths}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Peak Availability</div>
                    <div className="text-green-600">{crop.peakAvailability}</div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-4">
                  <Progress
                    value={crop.currentStatus === 'Peak Season' ? 100 : crop.currentStatus === 'In Season' ? 75 : 30}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Planting</span>
                    <span>Growing</span>
                    <span>Harvesting</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weatherImpact.map((weather, index) => {
              const WeatherIcon = weather.icon;
              return (
                <motion.div
                  key={weather.region}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <WeatherIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{weather.region}</h3>
                        <div className="text-sm text-gray-600">{weather.condition}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{weather.impact}</p>
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Favorable Crops:</div>
                      <div className="flex flex-wrap gap-2">
                        {weather.cropsFavorable.map((crop) => (
                          <Badge key={crop} variant="outline" className="text-xs">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="mt-6">
          <Card className="p-6">
            <h3 className="mb-6">6-Month Crop & Price Forecast</h3>
            <div className="space-y-4">
              {monthlyData.map((month, index) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-center min-w-[60px]">
                    <div className="text-lg">{month.month}</div>
                    <div className="text-xs text-gray-500">2025</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">In Season:</div>
                    <div className="flex flex-wrap gap-2">
                      {month.inSeason.map((crop) => (
                        <Badge key={crop} variant="outline">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <div className="text-xs text-gray-500 mb-1">Price Trend</div>
                    <div className="flex items-center gap-1 justify-end">
                      {month.price === 'rising' ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">Rising</span>
                        </>
                      ) : month.price === 'falling' ? (
                        <>
                          <TrendingDown className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">Falling</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Stable</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <div className="text-xs text-gray-500 mb-1">Weather</div>
                    <div className="text-sm">{month.weather}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
