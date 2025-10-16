import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, TrendingUp, Package, Award, Calendar, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'new_farm' | 'price_drop' | 'new_crop' | 'availability' | 'certification';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'new_farm',
      title: 'New Certified Farm',
      message: 'Kashmir Apple Orchards just joined the platform with premium apples!',
      time: '5 mins ago',
      read: false,
    },
    {
      id: '2',
      type: 'price_drop',
      title: 'Price Drop Alert',
      message: 'Onions price dropped by 15% at Maharashtra Grape Valley',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'new_crop',
      title: 'New Crop Available',
      message: 'Organic turmeric now available at Rajasthan Spice Farms',
      time: '3 hours ago',
      read: false,
    },
    {
      id: '4',
      type: 'availability',
      title: 'Early Availability',
      message: 'Bananas at Tamil Fresh Produce available 2 days earlier than expected',
      time: '5 hours ago',
      read: true,
    },
    {
      id: '5',
      type: 'certification',
      title: 'New Certification',
      message: 'Green Valley Farms received ISO 22000 certification',
      time: '1 day ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_farm':
        return <Award className="h-5 w-5 text-green-600" />;
      case 'price_drop':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'new_crop':
        return <Package className="h-5 w-5 text-purple-600" />;
      case 'availability':
        return <Calendar className="h-5 w-5 text-orange-600" />;
      case 'certification':
        return <Award className="h-5 w-5 text-yellow-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-600" />
              <h2>Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-green-50/50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="text-xs text-gray-500">{notification.time}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </motion.div>
    </>
  );
}
