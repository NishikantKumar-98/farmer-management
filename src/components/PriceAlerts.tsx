import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Plus, Trash2, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { mockPriceAlerts, PriceAlert } from '../data/priceAlerts';
import { CROP_TYPES } from '../data/farms';
import { toast } from 'sonner@2.0.3';

export function PriceAlerts() {
  const [alerts, setAlerts] = useState(mockPriceAlerts);
  const [isAddingAlert, setIsAddingAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    cropType: '',
    targetPrice: '',
    condition: 'below' as 'below' | 'above',
  });

  const handleAddAlert = () => {
    if (!newAlert.cropType || !newAlert.targetPrice) {
      toast.error('Please fill all fields');
      return;
    }

    const alert: PriceAlert = {
      id: `ALERT-${Date.now()}`,
      cropType: newAlert.cropType,
      targetPrice: Number(newAlert.targetPrice),
      currentPrice: 25000, // Mock current price
      condition: newAlert.condition,
      active: true,
      createdDate: new Date().toISOString().split('T')[0],
      triggered: false,
    };

    setAlerts([...alerts, alert]);
    setIsAddingAlert(false);
    setNewAlert({ cropType: '', targetPrice: '', condition: 'below' });
    toast.success('Price alert created successfully!');
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success('Alert deleted');
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
  };

  const activeAlerts = alerts.filter(a => a.active);
  const triggeredAlerts = alerts.filter(a => a.triggered);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-1">Price Alerts</h2>
          <p className="text-gray-600 text-sm">
            Get notified when crop prices reach your target
          </p>
        </div>
        <Button onClick={() => setIsAddingAlert(true)} className="gap-2 bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" />
          Create Alert
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <Bell className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Alerts</div>
              <div className="text-2xl">{activeAlerts.length}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Triggered</div>
              <div className="text-2xl">{triggeredAlerts.length}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Alerts</div>
              <div className="text-2xl">{alerts.length}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        <h3>Your Alerts</h3>
        
        {alerts.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl mb-2 text-gray-600">No Price Alerts</h3>
            <p className="text-gray-500 mb-4">
              Create alerts to get notified when prices reach your target
            </p>
            <Button onClick={() => setIsAddingAlert(true)} className="bg-green-600 hover:bg-green-700">
              Create Your First Alert
            </Button>
          </Card>
        ) : (
          alerts.map((alert, index) => {
            const Icon = alert.condition === 'below' ? TrendingDown : TrendingUp;
            const priceMatch = alert.condition === 'below'
              ? alert.currentPrice <= alert.targetPrice
              : alert.currentPrice >= alert.targetPrice;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 border-2 ${alert.triggered ? 'border-orange-300 bg-orange-50' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        alert.triggered ? 'bg-orange-100' :
                        alert.active ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          alert.triggered ? 'text-orange-600' :
                          alert.active ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg">{alert.cropType}</h3>
                          {alert.triggered && (
                            <Badge className="bg-orange-600">Triggered!</Badge>
                          )}
                          {!alert.active && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500 mb-1">Target Price</div>
                            <div className="font-medium">₹{alert.targetPrice.toLocaleString()}/ton</div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Current Price</div>
                            <div className={`font-medium ${priceMatch ? 'text-green-600' : ''}`}>
                              ₹{alert.currentPrice.toLocaleString()}/ton
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 mb-1">Condition</div>
                            <div className="font-medium capitalize">
                              Alert when {alert.condition} target
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                          Created: {new Date(alert.createdDate).toLocaleDateString()}
                          {alert.triggeredDate && (
                            <> • Triggered: {new Date(alert.triggeredDate).toLocaleDateString()}</>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAlert(alert.id)}
                      >
                        {alert.active ? 'Pause' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Alert Dialog */}
      <Dialog open={isAddingAlert} onOpenChange={setIsAddingAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-600" />
              Create Price Alert
            </DialogTitle>
            <DialogDescription>
              Get notified when a crop reaches your target price
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cropType">Crop Type</Label>
              <select
                id="cropType"
                value={newAlert.cropType}
                onChange={(e) => setNewAlert({ ...newAlert, cropType: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="">Select crop</option>
                {CROP_TYPES.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="targetPrice">Target Price (₹/ton)</Label>
              <Input
                id="targetPrice"
                type="number"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                placeholder="e.g., 25000"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Alert Condition</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant={newAlert.condition === 'below' ? 'default' : 'outline'}
                  onClick={() => setNewAlert({ ...newAlert, condition: 'below' })}
                  className="flex-1 gap-2"
                >
                  <TrendingDown className="h-4 w-4" />
                  Below Target
                </Button>
                <Button
                  type="button"
                  variant={newAlert.condition === 'above' ? 'default' : 'outline'}
                  onClick={() => setNewAlert({ ...newAlert, condition: 'above' })}
                  className="flex-1 gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Above Target
                </Button>
              </div>
            </div>

            <Button
              onClick={handleAddAlert}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Create Alert
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
