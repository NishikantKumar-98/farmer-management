export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'buyer' | 'farmer';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  farmId: string;
  farmName: string;
  farmerName: string;
  buyerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived';
}

export const mockConversations: Conversation[] = [
  {
    id: 'CONV-001',
    farmId: '1',
    farmName: 'Green Valley Farms',
    farmerName: 'Harpreet Singh',
    buyerName: 'You',
    lastMessage: 'Sure, I can arrange that quantity. When do you need it?',
    lastMessageTime: '2025-10-16T14:30:00',
    unreadCount: 1,
    status: 'active',
  },
  {
    id: 'CONV-002',
    farmId: '9',
    farmName: 'Rajasthan Spice Farms',
    farmerName: 'Vijay Singh Rathore',
    buyerName: 'You',
    lastMessage: 'The spice quality certificates are attached in the previous message.',
    lastMessageTime: '2025-10-15T10:15:00',
    unreadCount: 0,
    status: 'active',
  },
  {
    id: 'CONV-003',
    farmId: '11',
    farmName: 'Kashmir Apple Orchards',
    farmerName: 'Farooq Ahmad',
    buyerName: 'You',
    lastMessage: 'Apples will be ready for harvest next week!',
    lastMessageTime: '2025-10-14T16:45:00',
    unreadCount: 2,
    status: 'active',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'MSG-001',
    conversationId: 'CONV-001',
    senderId: 'buyer-1',
    senderName: 'You',
    senderType: 'buyer',
    message: 'Hi, I\'m interested in ordering 50 tons of wheat. Is that available?',
    timestamp: '2025-10-16T14:00:00',
    read: true,
  },
  {
    id: 'MSG-002',
    conversationId: 'CONV-001',
    senderId: 'farmer-1',
    senderName: 'Harpreet Singh',
    senderType: 'farmer',
    message: 'Hello! Yes, we have that quantity available. It will be ready in 15 days.',
    timestamp: '2025-10-16T14:15:00',
    read: true,
  },
  {
    id: 'MSG-003',
    conversationId: 'CONV-001',
    senderId: 'buyer-1',
    senderName: 'You',
    senderType: 'buyer',
    message: 'Perfect! Can you deliver it to Mumbai?',
    timestamp: '2025-10-16T14:20:00',
    read: true,
  },
  {
    id: 'MSG-004',
    conversationId: 'CONV-001',
    senderId: 'farmer-1',
    senderName: 'Harpreet Singh',
    senderType: 'farmer',
    message: 'Sure, I can arrange that quantity. When do you need it?',
    timestamp: '2025-10-16T14:30:00',
    read: false,
  },
];
