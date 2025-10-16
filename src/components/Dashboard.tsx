import { motion } from 'motion/react';
import { TrendingUp, Package, MapPin, Award, Calendar, DollarSign } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Farm } from '../data/farms';

interface DashboardProps {
  farms: Farm[];
}

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Dashboard({ farms }: DashboardProps) {
  // Aggregate data
  const totalFarms = farms.length;
  const certifiedFarms = farms.filter((f) => f.certified).length;
  const totalCrops = farms.reduce((sum, farm) => sum + farm.crops.length, 0);
  const avgRating = (farms.reduce((sum, farm) => sum + farm.rating, 0) / farms.length).toFixed(1);

  // Crop distribution
  const cropDistribution: { [key: string]: number } = {};
  farms.forEach((farm) => {
    farm.crops.forEach((crop) => {
      cropDistribution[crop.type] = (cropDistribution[crop.type] || 0) + crop.quantity;
    });
  });

  const cropData = Object.entries(cropDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // State distribution
  const stateDistribution: { [key: string]: number } = {};
  farms.forEach((farm) => {
    stateDistribution[farm.state] = (stateDistribution[farm.state] || 0) + 1;
  });

  const stateData = Object.entries(stateDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Price trends (mock data for demonstration)
  const priceTrends = [
    { month: 'May', wheat: 24000, rice: 30000, onions: 20000 },
    { month: 'Jun', wheat: 24500, rice: 30500, onions: 21000 },
    { month: 'Jul', wheat: 25000, rice: 31000, onions: 22000 },
    { month: 'Aug', wheat: 25500, rice: 31500, onions: 22500 },
    { month: 'Sep', wheat: 26000, rice: 32000, onions: 23000 },
    { month: 'Oct', wheat: 25500, rice: 31500, onions: 22000 },
  ];

  // Availability timeline
  const availabilityData = [
    { range: '0-7 days', count: farms.filter(f => f.crops.some(c => c.availableIn <= 7)).length },
    { range: '8-15 days', count: farms.filter(f => f.crops.some(c => c.availableIn > 7 && c.availableIn <= 15)).length },
    { range: '16-30 days', count: farms.filter(f => f.crops.some(c => c.availableIn > 15 && c.availableIn <= 30)).length },
    { range: '30+ days', count: farms.filter(f => f.crops.some(c => c.availableIn > 30)).length },
  ];

  // Top farms by rating
  const topFarms = [...farms]
    .sort((a, b) => b.rating - a.rating || b.totalOrders - a.totalOrders)
    .slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Farms</div>
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl mb-1">{totalFarms}</div>
            <Progress value={(certifiedFarms / totalFarms) * 100} className="h-2" />
            <div className="text-xs text-gray-500 mt-2">
              {certifiedFarms} certified ({((certifiedFarms / totalFarms) * 100).toFixed(0)}%)
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Available Crops</div>
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl mb-1">{totalCrops}</div>
            <div className="text-xs text-gray-500 mt-2">
              {Object.keys(cropDistribution).length} unique varieties
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Avg. Rating</div>
              <Award className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-3xl mb-1">{avgRating}</div>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(Number(avgRating))
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Orders</div>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl mb-1">
              {farms.reduce((sum, farm) => sum + farm.totalOrders, 0)}
            </div>
            <div className="text-xs text-green-600 mt-2">↑ 12% from last month</div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 border-2">
            <h3 className="mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Crop Distribution (by Quantity)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* State Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 border-2">
            <h3 className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Farms by State
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stateData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 border-2">
            <h3 className="mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              Price Trends (₹/ton)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="wheat" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="rice" stroke="#16a34a" strokeWidth={2} />
                <Line type="monotone" dataKey="onions" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Availability Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6 border-2">
            <h3 className="mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Crop Availability Timeline
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={availabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Top Farms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="p-6 border-2">
          <h3 className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Top Rated Farms
          </h3>
          <div className="space-y-3">
            {topFarms.map((farm, index) => (
              <div
                key={farm.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-2xl w-8 text-center text-gray-400">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{farm.name}</span>
                    {farm.certified && (
                      <Badge className="bg-green-600 text-xs">Certified</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {farm.location}, {farm.state}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <span>★</span>
                    <span>{farm.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {farm.totalOrders} orders
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
