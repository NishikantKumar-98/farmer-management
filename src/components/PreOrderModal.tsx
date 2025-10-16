import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  CheckCircle2, 
  Package, 
  Calendar, 
  DollarSign, 
  MapPin,
  X,
  CreditCard,
  Truck
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Farm, Crop } from '../data/farms';
import { toast } from 'sonner@2.0.3';

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: Farm | null;
  crop: Crop | null;
}

export function PreOrderModal({ isOpen, onClose, farm, crop }: PreOrderModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'bank'>('upi');

  const totalPrice = crop ? quantity * crop.pricePerUnit : 0;
  const advancePayment = totalPrice * 0.2; // 20% advance

  const handleClose = () => {
    setStep('details');
    setQuantity(1);
    setBuyerName('');
    setBuyerContact('');
    setDeliveryAddress('');
    onClose();
  };

  const handleDetailsSubmit = () => {
    if (!buyerName || !buyerContact || !deliveryAddress) {
      toast.error('Please fill all required fields');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = () => {
    // Simulate payment processing
    setTimeout(() => {
      setStep('confirmation');
      toast.success('Pre-order confirmed successfully!');
    }, 1500);
  };

  if (!farm || !crop) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            Pre-Order: {crop.type}
          </DialogTitle>
          <DialogDescription>
            Complete your pre-order for {crop.type} from {farm.name}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Farm & Crop Info */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3>{farm.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{farm.location}, {farm.state}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-600">
                    {crop.quality}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-600" />
                    <span>Available: {crop.quantity} {crop.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span>By {crop.forecastDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <span>₹{crop.pricePerUnit.toLocaleString()}/{crop.unit}</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity ({crop.unit})</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={crop.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum available: {crop.quantity} {crop.unit}
                  </p>
                </div>

                <div>
                  <Label htmlFor="buyerName">Your Name *</Label>
                  <Input
                    id="buyerName"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="buyerContact">Contact Number *</Label>
                  <Input
                    id="buyerContact"
                    value={buyerContact}
                    onChange={(e) => setBuyerContact(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                  <Input
                    id="deliveryAddress"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter complete delivery address"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Advance Payment (20%)</span>
                  <span>₹{advancePayment.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span>Total Amount</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleDetailsSubmit}
              >
                Proceed to Payment
              </Button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Details
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Amount:</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Advance (20%):</span>
                    <span className="text-green-600">₹{advancePayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                    <span>Balance on Delivery:</span>
                    <span>₹{(totalPrice - advancePayment).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('upi')}
                    className="h-auto py-3"
                  >
                    <div className="text-center">
                      <div>UPI</div>
                      <div className="text-xs opacity-70">PhonePe/GPay</div>
                    </div>
                  </Button>
                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('card')}
                    className="h-auto py-3"
                  >
                    <div className="text-center">
                      <div>Card</div>
                      <div className="text-xs opacity-70">Credit/Debit</div>
                    </div>
                  </Button>
                  <Button
                    variant={paymentMethod === 'bank' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('bank')}
                    className="h-auto py-3"
                  >
                    <div className="text-center">
                      <div>Bank</div>
                      <div className="text-xs opacity-70">Net Banking</div>
                    </div>
                  </Button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="space-y-3">
                    <Label htmlFor="upi">UPI ID</Label>
                    <Input id="upi" placeholder="yourname@upi" />
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" type="password" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="space-y-3">
                    <Label htmlFor="bank">Select Bank</Label>
                    <Input id="bank" placeholder="Enter bank name" />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                  Back
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handlePaymentSubmit}
                >
                  Pay ₹{advancePayment.toLocaleString()}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-6"
            >
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full p-6">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl mb-2">Pre-Order Confirmed!</h3>
                <p className="text-gray-600">Your order has been successfully placed</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono">ORD-{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Farm:</span>
                  <span>{farm.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Crop:</span>
                  <span>{crop.type} ({quantity} {crop.unit})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expected Delivery:</span>
                  <span>{crop.forecastDate}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-3">
                  <span className="text-gray-600">Paid (Advance):</span>
                  <span className="text-green-600">₹{advancePayment.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-left">
                    <p className="mb-1">What's Next?</p>
                    <p className="text-gray-600 text-xs">
                      The farmer will prepare your order. You'll receive updates via SMS and email. 
                      Pay the remaining amount upon delivery.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleClose}
              >
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
