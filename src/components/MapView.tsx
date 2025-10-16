import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Farm } from '../data/farms';
import { Award, MapPin } from 'lucide-react';

interface MapViewProps {
  farms: Farm[];
  onFarmClick: (farm: Farm) => void;
}

export function MapView({ farms, onFarmClick }: MapViewProps) {
  const [hoveredFarm, setHoveredFarm] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
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

  // Map bounds for India (approximate)
  const mapBounds = {
    minLat: 6.0,
    maxLat: 37.0,
    minLon: 68.0,
    maxLon: 98.0,
  };

  // Convert lat/lon to x/y coordinates
  const latLonToXY = (lat: number, lon: number) => {
    const padding = 40;
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

  return (
    <div ref={containerRef} className="relative h-full w-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg overflow-hidden border-2 border-gray-200">
      {/* Background Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Map Title */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 z-10">
        <h3 className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          India Farm Network
        </h3>
      </div>

      {/* Farm Markers */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {farms.map((farm) => {
          const { x, y } = latLonToXY(farm.lat, farm.lon);
          const isHovered = hoveredFarm === farm.id;

          return (
            <g key={farm.id} className="pointer-events-auto cursor-pointer">
              {/* Marker Pin */}
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => onFarmClick(farm)}
                onMouseEnter={() => setHoveredFarm(farm.id)}
                onMouseLeave={() => setHoveredFarm(null)}
              >
                {/* Pin Shadow */}
                <ellipse
                  cx={x}
                  cy={y + 30}
                  rx="8"
                  ry="4"
                  fill="black"
                  opacity="0.2"
                />
                
                {/* Pin Body */}
                <path
                  d={`M ${x} ${y - 25} 
                      C ${x - 15} ${y - 25}, ${x - 20} ${y - 15}, ${x - 20} ${y - 5}
                      C ${x - 20} ${y + 5}, ${x} ${y + 20}, ${x} ${y + 20}
                      C ${x} ${y + 20}, ${x + 20} ${y + 5}, ${x + 20} ${y - 5}
                      C ${x + 20} ${y - 15}, ${x + 15} ${y - 25}, ${x} ${y - 25} Z`}
                  fill={farm.certified ? '#16a34a' : '#3b82f6'}
                  stroke="white"
                  strokeWidth="2"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                />
                
                {/* Pin Inner Circle */}
                <circle
                  cx={x}
                  cy={y - 10}
                  r="8"
                  fill="white"
                  opacity="0.9"
                />
                
                {/* Certified Badge */}
                {farm.certified && (
                  <circle
                    cx={x}
                    cy={y - 10}
                    r="5"
                    fill="#fbbf24"
                  />
                )}

                {/* Pulse Effect on Hover */}
                {isHovered && (
                  <motion.circle
                    cx={x}
                    cy={y - 10}
                    r="20"
                    fill={farm.certified ? '#16a34a' : '#3b82f6'}
                    opacity="0.3"
                    initial={{ scale: 0.5, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.g>
            </g>
          );
        })}
      </svg>

      {/* Farm Info Cards on Hover */}
      {hoveredFarm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
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
              ).y - 100,
            transform: 'translateX(-50%)',
          }}
        >
          {(() => {
            const farm = farms.find((f) => f.id === hoveredFarm)!;
            return (
              <div className="bg-white rounded-lg shadow-xl p-3 border-2 border-gray-200 min-w-[200px]">
                <div className="flex items-start gap-2 mb-2">
                  <h4 className="text-sm flex-1">{farm.name}</h4>
                  {farm.certified && (
                    <Award className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {farm.location}, {farm.state}
                </p>
                <div className="text-xs text-gray-700">
                  <div>
                    {farm.crops.length} crop type
                    {farm.crops.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-green-600 mt-1">
                    Click to view details
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4"
      >
        <h4 className="text-sm mb-3">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-white shadow-sm"></div>
            <span>Certified Farms</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-sm"></div>
            <span>Standard Farms</span>
          </div>
        </div>
      </motion.div>

      {/* State Labels (Optional - adds context) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-gray-400 text-xs opacity-50">
          North India
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-gray-400 text-xs opacity-50">
          West India
        </div>
        <div className="absolute top-1/3 right-1/4 text-gray-400 text-xs opacity-50">
          East India
        </div>
        <div className="absolute bottom-1/3 left-1/2 text-gray-400 text-xs opacity-50">
          Central India
        </div>
        <div className="absolute bottom-1/4 right-1/3 text-gray-400 text-xs opacity-50">
          South India
        </div>
      </div>
    </div>
  );
}
