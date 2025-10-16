export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  farmId: string;
  farmName: string;
  cropType: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  advancePaid: number;
  status: OrderStatus;
  orderDate: string;
  expectedDelivery: string;
  deliveryAddress: string;
  buyerName: string;
  trackingUpdates: {
    status: OrderStatus;
    timestamp: string;
    message: string;
    location?: string;
  }[];
}

export const mockOrders: Order[] = [
  {
    id: 'ORD-12345678',
    farmId: '1',
    farmName: 'Green Valley Farms',
    cropType: 'Wheat',
    quantity: 10,
    unit: 'tons',
    totalAmount: 250000,
    advancePaid: 50000,
    status: 'dispatched',
    orderDate: '2025-10-01',
    expectedDelivery: '2025-10-31',
    deliveryAddress: 'Mumbai, Maharashtra',
    buyerName: 'Rajesh Enterprises',
    trackingUpdates: [
      {
        status: 'pending',
        timestamp: '2025-10-01T10:00:00',
        message: 'Order placed successfully',
      },
      {
        status: 'confirmed',
        timestamp: '2025-10-01T14:30:00',
        message: 'Order confirmed by farmer',
      },
      {
        status: 'preparing',
        timestamp: '2025-10-15T09:00:00',
        message: 'Crop harvesting started',
        location: 'Ludhiana, Punjab',
      },
      {
        status: 'dispatched',
        timestamp: '2025-10-28T08:00:00',
        message: 'Order dispatched via road transport',
        location: 'Ludhiana, Punjab',
      },
    ],
  },
  {
    id: 'ORD-23456789',
    farmId: '9',
    farmName: 'Rajasthan Spice Farms',
    cropType: 'Chilies',
    quantity: 5,
    unit: 'tons',
    totalAmount: 425000,
    advancePaid: 85000,
    status: 'delivered',
    orderDate: '2025-09-15',
    expectedDelivery: '2025-09-26',
    deliveryAddress: 'Delhi NCR',
    buyerName: 'Spice Traders Ltd',
    trackingUpdates: [
      {
        status: 'pending',
        timestamp: '2025-09-15T11:00:00',
        message: 'Order placed successfully',
      },
      {
        status: 'confirmed',
        timestamp: '2025-09-15T15:00:00',
        message: 'Order confirmed by farmer',
      },
      {
        status: 'preparing',
        timestamp: '2025-09-20T10:00:00',
        message: 'Quality check completed',
        location: 'Jaipur, Rajasthan',
      },
      {
        status: 'dispatched',
        timestamp: '2025-09-24T07:00:00',
        message: 'Order dispatched',
        location: 'Jaipur, Rajasthan',
      },
      {
        status: 'delivered',
        timestamp: '2025-09-26T16:00:00',
        message: 'Order delivered successfully',
        location: 'Delhi NCR',
      },
    ],
  },
  {
    id: 'ORD-34567890',
    farmId: '11',
    farmName: 'Kashmir Apple Orchards',
    cropType: 'Apples',
    quantity: 3,
    unit: 'tons',
    totalAmount: 225000,
    advancePaid: 45000,
    status: 'confirmed',
    orderDate: '2025-10-10',
    expectedDelivery: '2025-10-22',
    deliveryAddress: 'Bangalore, Karnataka',
    buyerName: 'Fresh Fruits Co.',
    trackingUpdates: [
      {
        status: 'pending',
        timestamp: '2025-10-10T09:00:00',
        message: 'Order placed successfully',
      },
      {
        status: 'confirmed',
        timestamp: '2025-10-10T12:00:00',
        message: 'Order confirmed by farmer',
      },
    ],
  },
  {
    id: 'ORD-45678901',
    farmId: '3',
    farmName: 'Maharashtra Agro Hub',
    cropType: 'Cotton',
    quantity: 8,
    unit: 'tons',
    totalAmount: 520000,
    advancePaid: 104000,
    status: 'preparing',
    orderDate: '2025-10-05',
    expectedDelivery: '2025-11-10',
    deliveryAddress: 'Ahmedabad, Gujarat',
    buyerName: 'Textile Mills Inc',
    trackingUpdates: [
      {
        status: 'pending',
        timestamp: '2025-10-05T10:30:00',
        message: 'Order placed successfully',
      },
      {
        status: 'confirmed',
        timestamp: '2025-10-05T16:00:00',
        message: 'Order confirmed by farmer',
      },
      {
        status: 'preparing',
        timestamp: '2025-10-14T08:00:00',
        message: 'Cotton harvesting in progress',
        location: 'Mumbai, Maharashtra',
      },
    ],
  },
];
