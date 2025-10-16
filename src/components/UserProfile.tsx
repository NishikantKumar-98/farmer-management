import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save,
  X,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  Camera
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

export function UserProfile() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    bio: '',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    priceAlerts: true,
    marketingEmails: false,
  });

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-1">My Profile</h2>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 p-6">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-4xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <h3 className="text-2xl mb-1">{user.name}</h3>
            <p className="text-gray-600 mb-3">{user.email}</p>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge className={user.role === 'buyer' ? 'bg-blue-600' : 'bg-green-600'}>
                {user.role === 'buyer' ? '👤 Buyer' : '🌾 Farmer'}
              </Badge>
              {user.verified ? (
                <Badge className="bg-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline">Not Verified</Badge>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span>{new Date(user.joinedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span>12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating</span>
                <span>⭐ 4.8</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Details & Settings */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Account Information</h3>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} className="gap-2 bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Notification Settings */}
            <div>
              <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notification Preferences
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm">Email Notifications</div>
                    <div className="text-xs text-gray-500">Receive order updates via email</div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm">SMS Notifications</div>
                    <div className="text-xs text-gray-500">Get SMS alerts for important updates</div>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, smsNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm">Price Alerts</div>
                    <div className="text-xs text-gray-500">Notify when prices reach targets</div>
                  </div>
                  <Switch
                    checked={settings.priceAlerts}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, priceAlerts: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm">Marketing Emails</div>
                    <div className="text-xs text-gray-500">Receive promotional offers</div>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => 
                      setSettings({ ...settings, marketingEmails: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Methods */}
            <div>
              <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Methods
              </h4>
              <Button variant="outline" size="sm">
                Add Payment Method
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
