import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Sprout, Eye, EyeOff, User, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface RegisterPageProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterPage({ onSuccess, onSwitchToLogin }: RegisterPageProps) {
  const [role, setRole] = useState<'buyer' | 'farmer'>('buyer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
      });
      
      if (success) {
        toast.success('Registration successful! Welcome to AgriConnect!');
        onSuccess();
      } else {
        toast.error('Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl relative"
      >
        <Card className="overflow-hidden border-2 shadow-2xl">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Registration Form */}
            <div className="p-12 order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2 md:hidden">
                  <Sprout className="h-6 w-6 text-green-600" />
                  <span className="text-xl">AgriConnect</span>
                </div>
                
                <h2 className="text-3xl mb-2">Create Account</h2>
                <p className="text-gray-600 mb-6">
                  Join our platform and start trading
                </p>

                <Tabs value={role} onValueChange={(v) => setRole(v as 'buyer' | 'farmer')} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buyer">Register as Buyer</TabsTrigger>
                    <TabsTrigger value="farmer">Register as Farmer</TabsTrigger>
                  </TabsList>
                </Tabs>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="John Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 rounded"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{' '}
                      <button type="button" className="text-green-600 hover:underline">
                        Terms & Conditions
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-green-600 hover:underline">
                        Privacy Policy
                      </button>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 h-11"
                  >
                    {isLoading ? (
                      'Creating account...'
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-green-600 hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Benefits */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-12 flex flex-col justify-center order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-8 hidden md:flex">
                  <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                    <Sprout className="h-12 w-12" />
                  </div>
                  <div>
                    <h1 className="text-4xl">AgriConnect</h1>
                    <p className="text-green-100 text-sm">Farm-to-Buyer Platform</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl mb-3">Why Join Us?</h2>
                    <p className="text-green-100">
                      {role === 'buyer' 
                        ? 'Source quality produce directly from verified farms across India.'
                        : 'Sell your produce directly to buyers and get fair prices.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {role === 'buyer' ? (
                      <>
                        <div className="flex gap-3">
                          <CheckCircle className="h-6 w-6 flex-shrink-0" />
                          <div>
                            <div className="font-medium mb-1">Direct Access</div>
                            <div className="text-sm text-green-100">
                              Connect directly with farmers without middlemen
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle className="h-6 w-6 flex-shrink-0" />
                          <div>
                            <div className="font-medium mb-1">Quality Assured</div>
                            <div className="text-sm text-green-100">
                              All farms are verified and certified
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle className="h-6 w-6 flex-shrink-0" />
                          <div>
                            <div className="font-medium mb-1">Transparent Pricing</div>
                            <div className="text-sm text-green-100">
                              See real-time prices and track your orders
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-3">
                          <CheckCircle className="h-6 w-6 flex-shrink-0" />
                          <div>
                            <div className="font-medium mb-1">Better Prices</div>
                            <div className="text-sm text-green-100">
                              Get fair prices without intermediaries
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle className="h-6 w-6 flex-shrink-0" />
                          <div>
                            <div className="font-medium mb-1">Guaranteed Sales</div>
                            <div className="text-sm text-green-100">
                              Pre-orders ensure your produce is sold
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle className="h-6 w-6 flex-shrink-0" />
                          <div>
                            <div className="font-medium mb-1">Market Insights</div>
                            <div className="text-sm text-green-100">
                              Access price trends and market data
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
