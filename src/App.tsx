import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { 
  Filter, 
  X, 
  List, 
  Map as MapIcon,
  BarChart3,
  Heart,
  GitCompare,
  Bell,
  Package,
  History,
  Leaf,
  User,
  MessageSquare,
  TrendingUp,
  FileText,
  HelpCircle
} from 'lucide-react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { MapView } from './components/MapView';
import { EnhancedMapView } from './components/EnhancedMapView';
import { FarmCard } from './components/FarmCard';
import { PreOrderModal } from './components/PreOrderModal';
import { Dashboard } from './components/Dashboard';
import { CompareFarms } from './components/CompareFarms';
import { NotificationsPanel } from './components/NotificationsPanel';
import { BulkOrderModal } from './components/BulkOrderModal';
import { OrderHistory } from './components/OrderHistory';
import { FarmerProfile } from './components/FarmerProfile';
import { SeasonalInsights } from './components/SeasonalInsights';
import { ChatMessaging } from './components/ChatMessaging';
import { PriceAlerts } from './components/PriceAlerts';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { UserProfile } from './components/UserProfile';
import { ContractManagement } from './components/ContractManagement';
import { HelpCenter } from './components/HelpCenter';
import { Wishlist } from './components/Wishlist';
import { Button } from './components/ui/button';
import { ScrollArea } from './components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';
import { useFavorites } from './hooks/useFavorites';
import { mockFarms, Farm, Crop, CROP_TYPES } from './data/farms';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBulkOrderOpen, setIsBulkOrderOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [useEnhancedMap, setUseEnhancedMap] = useState(true);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'dashboard' | 'compare' | 'orders' | 'seasonal' | 'alerts' | 'profile' | 'contracts' | 'wishlist' | 'help'>('marketplace');
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'profile'>('map');
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [preOrderData, setPreOrderData] = useState<{
    farm: Farm | null;
    crop: Crop | null;
  }>({ farm: null, crop: null });

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const [filters, setFilters] = useState({
    certifiedOnly: false,
    cropTypes: [] as string[],
    states: [] as string[],
    priceRange: [0, 100000] as [number, number],
    availabilityDays: 60,
  });

  // Filter farms based on active filters
  const filteredFarms = useMemo(() => {
    return mockFarms.filter((farm) => {
      // Certified filter
      if (filters.certifiedOnly && !farm.certified) return false;

      // State filter
      if (filters.states.length > 0 && !filters.states.includes(farm.state)) {
        return false;
      }

      // Crop type filter
      if (filters.cropTypes.length > 0) {
        const hasCrop = farm.crops.some((crop) =>
          filters.cropTypes.includes(crop.type)
        );
        if (!hasCrop) return false;
      }

      // Price and availability filters
      const hasMatchingCrop = farm.crops.some((crop) => {
        const priceInRange =
          crop.pricePerUnit >= filters.priceRange[0] &&
          crop.pricePerUnit <= filters.priceRange[1];
        const availabilityMatch = crop.availableIn <= filters.availabilityDays;
        return priceInRange && availabilityMatch;
      });

      return hasMatchingCrop;
    });
  }, [filters]);

  const handlePreOrder = (farm: Farm, crop: Crop) => {
    setPreOrderData({ farm, crop });
  };

  const handleFarmClick = (farm: Farm) => {
    setSelectedFarm(farm);
    if (viewMode === 'map') {
      setActiveTab('marketplace');
      setViewMode('profile');
    }
  };

  const handleViewProfile = (farm: Farm) => {
    setSelectedFarm(farm);
    setViewMode('profile');
  };

  const handleToggleCompare = (farmId: string) => {
    setCompareList((prev) => {
      if (prev.includes(farmId)) {
        return prev.filter((id) => id !== farmId);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 farms at a time');
          return prev;
        }
        return [...prev, farmId];
      }
    });
  };

  const compareFarms = mockFarms.filter((farm) => compareList.includes(farm.id));

  const stats = {
    totalFarms: mockFarms.length,
    certifiedFarms: mockFarms.filter((f) => f.certified).length,
    availableCrops: new Set(mockFarms.flatMap((f) => f.crops.map((c) => c.type)))
      .size,
  };

  const activeFiltersCount =
    (filters.certifiedOnly ? 1 : 0) +
    filters.cropTypes.length +
    filters.states.length;

  const hasNotifications = true; // Mock notification status

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginPage
          onSuccess={() => {}}
          onSwitchToRegister={() => setAuthView('register')}
        />
      );
    } else {
      return (
        <RegisterPage
          onSuccess={() => {}}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header {...stats} />

      {/* Search Bar & Quick Actions */}
      <div className="bg-white border-b px-4 py-3">
        <div className="container mx-auto flex items-center gap-4 flex-wrap">
          <SearchBar farms={mockFarms} onFarmSelect={handleFarmClick} />
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsChatOpen(true)}
              className="relative"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-600 rounded-full"></span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsBulkOrderOpen(true)}
              className="gap-2"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Bulk Order</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Filter Panel */}
        <FilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Notifications Panel */}
        <NotificationsPanel
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="flex-1 flex flex-col">
            <div className="bg-white border-b px-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <TabsList>
                  <TabsTrigger value="marketplace" className="gap-2">
                    <MapIcon className="h-4 w-4" />
                    Marketplace
                  </TabsTrigger>
                  <TabsTrigger value="dashboard" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="compare" className="gap-2">
                    <GitCompare className="h-4 w-4" />
                    Compare
                    {compareList.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {compareList.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="gap-2">
                    <History className="h-4 w-4" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="seasonal" className="gap-2">
                    <Leaf className="h-4 w-4" />
                    Seasonal
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Price Alerts
                  </TabsTrigger>
                  <TabsTrigger value="wishlist" className="gap-2">
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </TabsTrigger>
                  <TabsTrigger value="contracts" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Contracts
                  </TabsTrigger>
                  <TabsTrigger value="help" className="gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Help
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                </TabsList>

                {/* Marketplace Controls */}
                {activeTab === 'marketplace' && (
                  <div className="flex items-center gap-3 py-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsFilterOpen(true)}
                      className="gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="destructive" className="rounded-full">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>

                    <div className="text-sm text-gray-600 hidden sm:block">
                      <span>{filteredFarms.length}</span> farms
                    </div>

                    <div className="flex items-center gap-1 border rounded-lg">
                      <Button
                        variant={viewMode === 'map' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('map')}
                        size="sm"
                        className="gap-2"
                      >
                        <MapIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Map</span>
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        onClick={() => setViewMode('list')}
                        size="sm"
                        className="gap-2"
                      >
                        <List className="h-4 w-4" />
                        <span className="hidden sm:inline">List</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-hidden">
              <TabsContent value="marketplace" className="h-full m-0">
                <AnimatePresence mode="wait">
                  {viewMode === 'profile' && selectedFarm ? (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full w-full"
                    >
                      <ScrollArea className="h-full">
                        <FarmerProfile
                          farm={selectedFarm}
                          onPreOrder={handlePreOrder}
                          onClose={() => {
                            setViewMode('list');
                            setSelectedFarm(null);
                          }}
                        />
                      </ScrollArea>
                    </motion.div>
                  ) : viewMode === 'map' ? (
                    <motion.div
                      key="map"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full w-full p-4"
                    >
                      {useEnhancedMap ? (
                        <EnhancedMapView farms={filteredFarms} onFarmClick={handleFarmClick} />
                      ) : (
                        <MapView farms={filteredFarms} onFarmClick={handleFarmClick} />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full w-full"
                    >
                      <ScrollArea className="h-full">
                        <div className="p-4 space-y-4">
                          {/* Favorites Section */}
                          {favorites.length > 0 && !selectedFarm && (
                            <div className="mb-6">
                              <div className="flex items-center gap-2 mb-3">
                                <Heart className="h-5 w-5 text-red-600 fill-red-600" />
                                <h3 className="text-lg">Your Favorites ({favorites.length})</h3>
                              </div>
                              <div className="space-y-4">
                                {mockFarms
                                  .filter((farm) => favorites.includes(farm.id))
                                  .slice(0, 3)
                                  .map((farm) => (
                                    <FarmCard
                                      key={farm.id}
                                      farm={farm}
                                      onPreOrder={handlePreOrder}
                                      isFavorite={isFavorite(farm.id)}
                                      onToggleFavorite={toggleFavorite}
                                      isComparing={compareList.includes(farm.id)}
                                      onToggleCompare={handleToggleCompare}
                                    />
                                  ))}
                              </div>
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => handleViewProfile(mockFarms.find(f => favorites.includes(f.id))!)}
                                className="w-full"
                              >
                                View All Favorites
                              </Button>
                              {favorites.length > 3 && (
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                  + {favorites.length - 3} more favorites
                                </p>
                              )}
                            </div>
                          )}

                          {selectedFarm && (
                            <div className="mb-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedFarm(null)}
                                className="gap-2"
                              >
                                <X className="h-4 w-4" />
                                Clear Selection
                              </Button>
                            </div>
                          )}

                          {!selectedFarm && filteredFarms.length > 0 && (
                            <h3 className="text-lg mb-3">All Farms</h3>
                          )}

                          {(selectedFarm ? [selectedFarm] : filteredFarms).map(
                            (farm) => (
                              <FarmCard
                                key={farm.id}
                                farm={farm}
                                onPreOrder={handlePreOrder}
                                isFavorite={isFavorite(farm.id)}
                                onToggleFavorite={toggleFavorite}
                                isComparing={compareList.includes(farm.id)}
                                onToggleCompare={handleToggleCompare}
                              />
                            )
                          )}

                          {filteredFarms.length === 0 && (
                            <div className="text-center py-12">
                              <div className="text-gray-400 mb-4">
                                <Filter className="h-16 w-16 mx-auto" />
                              </div>
                              <h3 className="text-xl mb-2 text-gray-600">
                                No farms found
                              </h3>
                              <p className="text-gray-500 mb-4">
                                Try adjusting your filters to see more results
                              </p>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setFilters({
                                    certifiedOnly: false,
                                    cropTypes: [],
                                    states: [],
                                    priceRange: [0, 100000],
                                    availabilityDays: 60,
                                  })
                                }
                              >
                                Clear All Filters
                              </Button>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="dashboard" className="h-full m-0">
                <ScrollArea className="h-full">
                  <Dashboard farms={mockFarms} />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="compare" className="h-full m-0">
                <ScrollArea className="h-full">
                  <CompareFarms
                    farms={compareFarms}
                    onRemove={(farmId) =>
                      setCompareList((prev) => prev.filter((id) => id !== farmId))
                    }
                    onClear={() => setCompareList([])}
                  />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="orders" className="h-full m-0">
                <ScrollArea className="h-full">
                  <OrderHistory />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="seasonal" className="h-full m-0">
                <ScrollArea className="h-full">
                  <SeasonalInsights />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="alerts" className="h-full m-0">
                <ScrollArea className="h-full">
                  <PriceAlerts />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="wishlist" className="h-full m-0">
                <ScrollArea className="h-full">
                  <Wishlist onPreOrder={handlePreOrder} />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="contracts" className="h-full m-0">
                <ScrollArea className="h-full">
                  <ContractManagement />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="help" className="h-full m-0">
                <ScrollArea className="h-full">
                  <HelpCenter />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="profile" className="h-full m-0">
                <ScrollArea className="h-full">
                  <UserProfile />
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Chat Messaging */}
      <ChatMessaging
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Modals */}
      <PreOrderModal
        isOpen={!!preOrderData.farm && !!preOrderData.crop}
        onClose={() => setPreOrderData({ farm: null, crop: null })}
        farm={preOrderData.farm}
        crop={preOrderData.crop}
      />

      <BulkOrderModal
        isOpen={isBulkOrderOpen}
        onClose={() => setIsBulkOrderOpen(false)}
      />

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
