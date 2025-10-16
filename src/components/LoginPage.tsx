import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Sprout, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export function LoginPage({ onSuccess, onSwitchToRegister }: LoginPageProps) {
  const [role, setRole] = useState<'buyer' | 'farmer'>('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password, role);
      
      if (success) {
        toast.success('Login successful!');
        onSuccess();
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { email: 'buyer@test.com', password: 'demo123', role: 'buyer' as const },
    { email: 'farmer@test.com', password: 'demo123', role: 'farmer' as const },
  ];

  const fillDemo = (demo: typeof demoCredentials[0]) => {
    setRole(demo.role);
    setEmail(demo.email);
    setPassword(demo.password);
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
        className="w-full max-w-4xl relative"
      >
        <Card className="overflow-hidden border-2 shadow-2xl">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Branding */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-8">
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
                    <h2 className="text-2xl mb-3">Welcome Back!</h2>
                    <p className="text-green-100">
                      Connect with farmers and buyers across India. Build transparent,
                      reliable agricultural trade relationships.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                      <span>15+ verified farms</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                      <span>Real-time crop availability</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                      <span>Secure transactions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
                      <span>Direct farmer-buyer chat</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl mb-2">Sign In</h2>
                <p className="text-gray-600 mb-8">
                  Enter your credentials to access your account
                </p>

                <Tabs value={role} onValueChange={(v) => setRole(v as 'buyer' | 'farmer')} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buyer">I'm a Buyer</TabsTrigger>
                    <TabsTrigger value="farmer">I'm a Farmer</TabsTrigger>
                  </TabsList>
                </Tabs>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Remember me</span>
                    </label>
                    <button type="button" className="text-sm text-green-600 hover:underline">
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 h-11"
                  >
                    {isLoading ? (
                      'Signing in...'
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800 mb-2 font-medium">Demo Accounts:</p>
                  <div className="flex gap-2 flex-wrap">
                    {demoCredentials.map((demo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => fillDemo(demo)}
                        className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-md text-blue-700 transition-colors"
                      >
                        {demo.role === 'buyer' ? '👤 Buyer' : '🌾 Farmer'}: {demo.email}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-green-600 hover:underline font-medium"
                  >
                    Sign up now
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
