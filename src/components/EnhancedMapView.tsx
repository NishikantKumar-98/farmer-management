import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Farm } from '../data/farms';
import { Award, MapPin, Maximize2, Minimize2, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface EnhancedMapViewProps {
  farms: Farm[];
  onFarmClick: (farm: Farm) => void;
}

// India state boundaries (simplified coordinates)
const indiaStates = [
  { name: 'Punjab', path: 'M 200,120 L 240,110 L 260,130 L 245,150 L 210,145 Z', color: '#dcfce7' },
  { name: 'Haryana', path: 'M 240,140 L 270,135 L 280,160 L 255,165 L 245,150 Z', color: '#dbeafe' },
  { name: 'Uttar Pradesh', path: 'M 280,160 L 350,155 L 360,180 L 340,200 L 290,190 L 280,170 Z', color: '#fef3c7' },
  { name: 'Maharashtra', path: 'M 220,350 L 280,340 L 310,370 L 300,410 L 240,420 L 220,390 Z', color: '#fce7f3' },
  { name: 'Karnataka', path: 'M 240,430 L 300,420 L 310,470 L 280,500 L 240,490 Z', color: '#e0e7ff' },
  { name: 'Tamil Nadu', path: 'M 290,500 L 330,495 L 340,540 L 310,560 L 280,545 Z', color: '#fef9c3' },
  { name: 'West Bengal', path: 'M 390,240 L 440,235 L 450,270 L 420,280 L 395,260 Z', color: '#dcfce7' },
  { name: 'Gujarat', path: 'M 150,280 L 220,270 L 240,320 L 210,350 L 160,340 Z', color: '#fce7f3' },
  { name: 'Rajasthan', path: 'M 170,180 L 240,170 L 260,240 L 220,260 L 180,240 Z', color: '#fed7aa' },
  { name: 'Madhya Pradesh', path: 'M 260,240 L 340,230 L 360,280 L 320,310 L 270,300 Z', color: '#f3e8ff' },
  { name: 'Jammu & Kashmir', path: 'M 180,60 L 240,50 L 260,90 L 230,110 L 190,100 Z', color: '#ddd6fe' },
];

export function EnhancedMapView({ farms, onFarmClick }: EnhancedMapViewProps) {
  const [hoveredFarm, setHoveredFarm] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showClusters, setShowClusters] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const mapBounds = {
    minLat: 6.0,
    maxLat: 37.0,
    minLon: 68.0,
    maxLon: 98.0,
  };

  const latLonToXY = (lat: number, lon: number) => {
    const padding = 60;
    const x =
      ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon)) *
        (dimensions.width - padding * 2) +
      padding;
    const y =
      dimensions.height -
      ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) *
        (dimensions.height - padding * 2) -
      padding;
    return { x, y };
  };

  // Calculate farm density per state
  const stateDensity = indiaStates.map(state => {
    const count = farms.filter(f => f.state === state.name).length;
    return { ...state, farmCount: count };
  });

  // Cluster nearby farms
  const createClusters = () => {
    if (!showClusters) return farms.map(f => ({ ...f, cluster: [f] }));
    
    const clusters: { farm: Farm; cluster: Farm[] }[] = [];
    const processed = new Set<string>();
    
    farms.forEach(farm => {
      if (processed.has(farm.id)) return;
      
      const nearby = farms.filter(f => {
        if (processed.has(f.id)) return false;
        const dist = Math.sqrt(
          Math.pow(f.lat - farm.lat, 2) + Math.pow(f.lon - farm.lon, 2)
        );
        return dist < 2; // Cluster within 2 degrees
      });
      
      nearby.forEach(f => processed.add(f.id));
      clusters.push({ farm, cluster: nearby });
    });
    
    return clusters;
  };

  const clusters = createClusters();

  return (
    <div 
      ref={containerRef} 
      className={`relative bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 rounded-lg overflow-hidden border-2 border-gray-200 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-full'
      }`}
    >
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 space-y-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={showHeatmap}
              onCheckedChange={setShowHeatmap}
              id="heatmap"
            />
            <Label htmlFor="heatmap" className="text-xs cursor-pointer">
              Density View
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={showClusters}
              onCheckedChange={setShowClusters}
              id="clusters"
            />
            <Label htmlFor="clusters" className="text-xs cursor-pointer">
              Cluster Farms
            </Label>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-full"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Map Title */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 z-10">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="h-5 w-5 text-green-600" />
          <h3 className="text-lg">India Farm Network</h3>
        </div>
        <div className="text-xs text-gray-600">
          {farms.length} farms across {new Set(farms.map(f => f.state)).size} states
        </div>
      </div>

      {/* SVG Map */}
      <svg className="w-full h-full">
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.5" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.3" opacity="0.3" />
          </pattern>
        </defs>

        {/* Ocean Background */}
        <rect width="100%" height="100%" fill="url(#oceanGradient)" />
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* India States */}
        <g>
          {stateDensity.map((state) => (
            <g key={state.name}>
              <motion.path
                d={state.path}
                fill={showHeatmap && state.farmCount > 0 
                  ? `rgba(34, 197, 94, ${Math.min(state.farmCount / 5, 0.8)})` 
                  : state.color}
                stroke="#059669"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredState === state.name ? 1 : 0.7 }}
                onMouseEnter={() => setHoveredState(state.name)}
                onMouseLeave={() => setHoveredState(null)}
                className="cursor-pointer transition-all duration-200 hover:stroke-green-600"
                style={{ 
                  filter: hoveredState === state.name ? 'url(#glow)' : 'none',
                  strokeWidth: hoveredState === state.name ? '3' : '2',
                }}
              />
              {/* State Label */}
              {state.name === hoveredState && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <text
                    x="0"
                    y="0"
                    className="text-xs font-medium"
                    fill="#047857"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      transform: `translate(${state.path.match(/M (\d+),(\d+)/)?.[1] || 0}px, ${state.path.match(/M (\d+),(\d+)/)?.[2] || 0}px)`,
                    }}
                  >
                    {state.name}
                  </text>
                  <text
                    x="0"
                    y="15"
                    className="text-xs"
                    fill="#059669"
                    textAnchor="middle"
                    style={{
                      transform: `translate(${state.path.match(/M (\d+),(\d+)/)?.[1] || 0}px, ${state.path.match(/M (\d+),(\d+)/)?.[2] || 0}px)`,
                    }}
                  >
                    {state.farmCount} farms
                  </text>
                </motion.g>
              )}
            </g>
          ))}
        </g>

        {/* Farm Markers/Clusters */}
        {clusters.map((cluster) => {
          const { x, y } = latLonToXY(cluster.farm.lat, cluster.farm.lon);
          const isHovered = hoveredFarm === cluster.farm.id;
          const isCluster = cluster.cluster.length > 1;
          const certifiedCount = cluster.cluster.filter(f => f.certified).length;

          return (
            <g key={cluster.farm.id} className="pointer-events-auto cursor-pointer">
              {/* Pulse Animation for clusters */}
              {isCluster && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="30"
                  fill={certifiedCount > 0 ? '#16a34a' : '#3b82f6'}
                  opacity="0.2"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: [0.5, 1.5, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Main Marker */}
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHovered ? 1.3 : 1, 
                  opacity: 1 
                }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => onFarmClick(cluster.farm)}
                onMouseEnter={() => setHoveredFarm(cluster.farm.id)}
                onMouseLeave={() => setHoveredFarm(null)}
              >
                {/* Shadow */}
                <ellipse
                  cx={x}
                  cy={y + 35}
                  rx={isCluster ? 12 : 8}
                  ry={isCluster ? 5 : 4}
                  fill="black"
                  opacity="0.2"
                />
                
                {/* Pin Shape */}
                <path
                  d={`M ${x} ${y - 30} 
                      C ${x - 18} ${y - 30}, ${x - 25} ${y - 20}, ${x - 25} ${y - 8}
                      C ${x - 25} ${y + 5}, ${x} ${y + 25}, ${x} ${y + 25}
                      C ${x} ${y + 25}, ${x + 25} ${y + 5}, ${x + 25} ${y - 8}
                      C ${x + 25} ${y - 20}, ${x + 18} ${y - 30}, ${x} ${y - 30} Z`}
                  fill={cluster.farm.certified ? '#16a34a' : '#3b82f6'}
                  stroke="white"
                  strokeWidth="3"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                />
                
                {/* Inner Circle */}
                <circle
                  cx={x}
                  cy={y - 13}
                  r={isCluster ? 12 : 10}
                  fill="white"
                  opacity="0.95"
                />
                
                {/* Cluster Count or Certified Badge */}
                {isCluster ? (
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-sm font-bold"
                    fill={cluster.farm.certified ? '#16a34a' : '#3b82f6'}
                  >
                    {cluster.cluster.length}
                  </text>
                ) : cluster.farm.certified ? (
                  <circle
                    cx={x}
                    cy={y - 13}
                    r="6"
                    fill="#fbbf24"
                  />
                ) : null}

                {/* Hover Glow */}
                {isHovered && (
                  <motion.circle
                    cx={x}
                    cy={y - 13}
                    r="25"
                    fill={cluster.farm.certified ? '#16a34a' : '#3b82f6'}
                    opacity="0.3"
                    initial={{ scale: 0.5, opacity: 0.5 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.g>
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredFarm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute pointer-events-none"
            style={{
              left: latLonToXY(
                farms.find((f) => f.id === hoveredFarm)!.lat,
                farms.find((f) => f.id === hoveredFarm)!.lon
              ).x,
              top:
                latLonToXY(
                  farms.find((f) => f.id === hoveredFarm)!.lat,
                  farms.find((f) => f.id === hoveredFarm)!.lon
                ).y - 120,
              transform: 'translateX(-50%)',
            }}
          >
            {(() => {
              const farm = farms.find((f) => f.id === hoveredFarm)!;
              const cluster = clusters.find(c => c.farm.id === hoveredFarm)!;
              
              return (
                <div className="bg-white rounded-lg shadow-2xl p-4 border-2 border-gray-200 min-w-[250px]">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{farm.name}</h4>
                      <p className="text-xs text-gray-600">
                        {farm.location}, {farm.state}
                      </p>
                    </div>
                    {farm.certified && (
                      <Award className="h-5 w-5 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  
                  {cluster.cluster.length > 1 && (
                    <Badge className="mb-2 bg-blue-600">
                      {cluster.cluster.length} farms in cluster
                    </Badge>
                  )}
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium">⭐ {farm.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crops:</span>
                      <span className="font-medium">{farm.crops.length} types</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders:</span>
                      <span className="font-medium">{farm.totalOrders}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-green-600 text-center">
                    Click to view details
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-10"
      >
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Legend
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-white shadow-sm"></div>
            <span>Certified Farms</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-sm"></div>
            <span>Standard Farms</span>
          </div>
          {showClusters && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">
                3
              </div>
              <span>Farm Cluster</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* State Density Stats */}
      {showHeatmap && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-10 max-w-xs"
        >
          <h4 className="text-sm font-medium mb-3">Farm Density</h4>
          <div className="space-y-1 text-xs max-h-48 overflow-y-auto">
            {stateDensity
              .filter(s => s.farmCount > 0)
              .sort((a, b) => b.farmCount - a.farmCount)
              .map((state) => (
                <div key={state.name} className="flex items-center justify-between gap-2">
                  <span className="text-gray-700">{state.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600"
                        style={{ width: `${(state.farmCount / farms.length) * 100}%` }}
                      />
                    </div>
                    <span className="font-medium w-6 text-right">{state.farmCount}</span>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
