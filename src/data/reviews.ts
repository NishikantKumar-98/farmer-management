export interface Review {
  id: string;
  farmId: string;
  buyerName: string;
  rating: number;
  comment: string;
  date: string;
  cropType: string;
  verified: boolean;
  helpful: number;
}

export const mockReviews: Review[] = [
  {
    id: 'REV-001',
    farmId: '1',
    buyerName: 'Amit K.',
    rating: 5,
    comment: 'Excellent quality wheat! The grains were fresh and well-packed. Delivery was on time.',
    date: '2025-09-20',
    cropType: 'Wheat',
    verified: true,
    helpful: 12,
  },
  {
    id: 'REV-002',
    farmId: '1',
    buyerName: 'Priya S.',
    rating: 4,
    comment: 'Good quality rice. Slightly delayed delivery but farmer kept me updated.',
    date: '2025-09-15',
    cropType: 'Rice',
    verified: true,
    helpful: 8,
  },
  {
    id: 'REV-003',
    farmId: '9',
    buyerName: 'Rohit M.',
    rating: 5,
    comment: 'Best quality chilies I have purchased! Spice level is perfect. Highly recommended.',
    date: '2025-09-28',
    cropType: 'Chilies',
    verified: true,
    helpful: 15,
  },
  {
    id: 'REV-004',
    farmId: '11',
    buyerName: 'Sneha P.',
    rating: 5,
    comment: 'Premium Kashmir apples. Sweet and crispy. Worth every rupee!',
    date: '2025-09-25',
    cropType: 'Apples',
    verified: true,
    helpful: 20,
  },
  {
    id: 'REV-005',
    farmId: '3',
    buyerName: 'Vikram D.',
    rating: 4,
    comment: 'Good quality cotton. Packaging could be better but overall satisfied.',
    date: '2025-09-10',
    cropType: 'Cotton',
    verified: true,
    helpful: 6,
  },
  {
    id: 'REV-006',
    farmId: '7',
    buyerName: 'Meera R.',
    rating: 5,
    comment: 'Organic certification genuine. Cotton quality is outstanding!',
    date: '2025-09-18',
    cropType: 'Cotton',
    verified: true,
    helpful: 11,
  },
  {
    id: 'REV-007',
    farmId: '12',
    buyerName: 'Karan J.',
    rating: 5,
    comment: 'Fresh grapes, perfectly ripe. Great for export quality.',
    date: '2025-09-22',
    cropType: 'Grapes',
    verified: true,
    helpful: 9,
  },
  {
    id: 'REV-008',
    farmId: '2',
    buyerName: 'Anjali T.',
    rating: 4,
    comment: 'Fresh tomatoes. Good packaging and timely delivery.',
    date: '2025-09-12',
    cropType: 'Tomatoes',
    verified: true,
    helpful: 7,
  },
];
