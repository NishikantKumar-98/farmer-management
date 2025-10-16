import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { mockOrders, Order, OrderStatus } from '../data/orders';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800', icon: Package },
  dispatched: { label: 'Dispatched', color: 'bg-orange-100 text-orange-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: Clock },
};

export function OrderHistory() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = filterStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === filterStatus);

  const getStatusProgress = (status: OrderStatus) => {
    const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'dispatched', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Order History</h2>
          <p className="text-gray-600 text-sm mt-1">Track and manage your orders</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          All Orders ({mockOrders.length})
        </Button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(status as OrderStatus)}
          >
            {config.label} ({mockOrders.filter(o => o.status === status).length})
          </Button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl mb-2 text-gray-600">No Orders Found</h3>
            <p className="text-gray-500">No orders match your current filter</p>
          </Card>
        ) : (
          filteredOrders.map((order, index) => {
            const StatusIcon = statusConfig[order.status].icon;
            const isExpanded = expandedOrder === order.id;
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
                  {/* Order Header */}
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg">{order.farmName}</h3>
                          <Badge className={statusConfig[order.status].color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[order.status].label}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Package className="h-3 w-3" />
                            <span>{order.cropType} - {order.quantity} {order.unit}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-600">Order ID</div>
                        <div className="font-mono text-sm mb-2">{order.id}</div>
                        <div className="text-lg">₹{order.totalAmount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          Paid: ₹{order.advancePaid.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {order.status !== 'cancelled' && (
                      <div className="mt-4">
                        <Progress value={getStatusProgress(order.status)} className="h-2" />
                      </div>
                    )}
                  </div>

                  {/* Order Body */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Expected Delivery</div>
                        <div className="text-sm">
                          {new Date(order.expectedDelivery).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Delivery Address</div>
                        <div className="text-sm">{order.deliveryAddress}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Buyer</div>
                        <div className="text-sm">{order.buyerName}</div>
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(order.id)}
                      className="w-full gap-2"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Hide Tracking Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          View Tracking Details
                        </>
                      )}
                    </Button>

                    {/* Tracking Timeline */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t"
                      >
                        <h4 className="text-sm mb-4">Order Tracking</h4>
                        <div className="space-y-4">
                          {order.trackingUpdates.map((update, idx) => {
                            const UpdateIcon = statusConfig[update.status].icon;
                            const isLast = idx === order.trackingUpdates.length - 1;
                            
                            return (
                              <div key={idx} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className={`rounded-full p-2 ${statusConfig[update.status].color}`}>
                                    <UpdateIcon className="h-4 w-4" />
                                  </div>
                                  {!isLast && (
                                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                                  )}
                                </div>
                                <div className="flex-1 pb-4">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <div className="text-sm">{update.message}</div>
                                      {update.location && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                          <MapPin className="h-3 w-3" />
                                          {update.location}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500 whitespace-nowrap">
                                      {new Date(update.timestamp).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
