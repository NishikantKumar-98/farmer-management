export interface Contract {
  id: string;
  farmId: string;
  farmName: string;
  buyerName: string;
  cropType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  deliverySchedule: string;
  paymentTerms: string;
  qualityStandards: string[];
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled';
  signedByBuyer: boolean;
  signedByFarmer: boolean;
  createdDate: string;
}

export const mockContracts: Contract[] = [
  {
    id: 'CONTRACT-001',
    farmId: '1',
    farmName: 'Green Valley Farms',
    buyerName: 'Rajesh Enterprises',
    cropType: 'Wheat',
    quantity: 100,
    unit: 'tons',
    pricePerUnit: 25000,
    totalAmount: 2500000,
    startDate: '2025-11-01',
    endDate: '2026-03-31',
    deliverySchedule: 'Monthly batches of 20 tons',
    paymentTerms: '30% advance, 70% on delivery',
    qualityStandards: ['Moisture < 12%', 'Protein > 11%', 'No foreign matter'],
    status: 'active',
    signedByBuyer: true,
    signedByFarmer: true,
    createdDate: '2025-10-15',
  },
  {
    id: 'CONTRACT-002',
    farmId: '9',
    farmName: 'Rajasthan Spice Farms',
    buyerName: 'Spice Traders Ltd',
    cropType: 'Chilies',
    quantity: 50,
    unit: 'tons',
    pricePerUnit: 85000,
    totalAmount: 4250000,
    startDate: '2025-11-15',
    endDate: '2026-02-15',
    deliverySchedule: 'Quarterly batches',
    paymentTerms: '50% advance, 50% on delivery',
    qualityStandards: ['Scoville > 30000', 'Moisture < 10%', 'Organic certified'],
    status: 'pending',
    signedByBuyer: true,
    signedByFarmer: false,
    createdDate: '2025-10-10',
  },
];
