import { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Calendar, FileText, CheckCircle2, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { CROP_TYPES } from '../data/farms';
import { toast } from 'sonner@2.0.3';

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkOrderModal({ isOpen, onClose }: BulkOrderModalProps) {
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    unit: 'tons',
    targetPrice: '',
    deliveryDate: '',
    location: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    additionalNotes: '',
  });

  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.cropType ||
      !formData.quantity ||
      !formData.companyName ||
      !formData.contactPerson ||
      !formData.phone
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    // Simulate submission
    setTimeout(() => {
      setStep('confirmation');
      toast.success('Bulk order request submitted successfully!');
    }, 1000);
  };

  const handleClose = () => {
    setStep('form');
    setFormData({
      cropType: '',
      quantity: '',
      unit: 'tons',
      targetPrice: '',
      deliveryDate: '',
      location: '',
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      additionalNotes: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Bulk Order Request
          </DialogTitle>
          <DialogDescription>
            Submit your bulk order requirements to get competitive quotes from multiple farmers
          </DialogDescription>
        </DialogHeader>

        {step === 'form' ? (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-700">
                Submit your bulk order requirements and we'll connect you with multiple
                farmers who can fulfill your needs. Get competitive quotes and
                guaranteed supply.
              </p>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Order Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="cropType">Crop Type *</Label>
                  <select
                    id="cropType"
                    value={formData.cropType}
                    onChange={(e) =>
                      setFormData({ ...formData, cropType: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select crop type</option>
                    {CROP_TYPES.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    placeholder="e.g., 100"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="tons">Tons</option>
                    <option value="quintals">Quintals</option>
                    <option value="kg">Kilograms</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="targetPrice">Target Price (₹/unit)</Label>
                  <Input
                    id="targetPrice"
                    type="number"
                    value={formData.targetPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, targetPrice: e.target.value })
                    }
                    placeholder="Optional"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryDate: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="location">Delivery Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="City, State"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Company Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="Enter company name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPerson: e.target.value })
                    }
                    placeholder="Full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 XXXXX XXXXX"
                    className="mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="company@example.com"
                    className="mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="additionalNotes">Additional Requirements</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, additionalNotes: e.target.value })
                    }
                    placeholder="Quality specifications, delivery terms, payment preferences, etc."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </div>
        ) : (
          <motion.div
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
              <h3 className="text-2xl mb-2">Request Submitted!</h3>
              <p className="text-gray-600">
                Your bulk order request has been received
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Request ID:</span>
                <span className="font-mono">BLK-{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Crop:</span>
                <span>{formData.cropType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span>
                  {formData.quantity} {formData.unit}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Company:</span>
                <span>{formData.companyName}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-left">
                  <p className="mb-1">What's Next?</p>
                  <p className="text-gray-600 text-xs">
                    We'll match your requirements with suitable farmers and send you
                    multiple quotes within 24-48 hours. You can then compare and
                    choose the best offer.
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
      </DialogContent>
    </Dialog>
  );
}
