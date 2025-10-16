export interface PriceAlert {
  id: string;
  cropType: string;
  targetPrice: number;
  currentPrice: number;
  condition: 'below' | 'above';
  active: boolean;
  createdDate: string;
  triggered: boolean;
  triggeredDate?: string;
}

export const mockPriceAlerts: PriceAlert[] = [
  {
    id: 'ALERT-001',
    cropType: 'Wheat',
    targetPrice: 24000,
    currentPrice: 25000,
    condition: 'below',
    active: true,
    createdDate: '2025-10-10',
    triggered: false,
  },
  {
    id: 'ALERT-002',
    cropType: 'Rice',
    targetPrice: 32000,
    currentPrice: 31500,
    condition: 'below',
    active: true,
    createdDate: '2025-10-12',
    triggered: true,
    triggeredDate: '2025-10-15',
  },
  {
    id: 'ALERT-003',
    cropType: 'Onions',
    targetPrice: 25000,
    currentPrice: 22000,
    condition: 'above',
    active: false,
    createdDate: '2025-10-08',
    triggered: false,
  },
];
