import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Eye, 
  EyeOff, 
  TestTube, 
  Shield, 
  RefreshCw
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
  loading?: boolean;
}

export function LoginPage({ onLogin, loading = false }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    captcha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaText, setCaptchaText] = useState('A5X9K');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setFormData(prev => ({ ...prev, captcha: '' }));
    setErrors(prev => ({ ...prev, captcha: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.captcha) {
      newErrors.captcha = 'Captcha is required';
    } else if (formData.captcha.toUpperCase() !== captchaText) {
      newErrors.captcha = 'Captcha is incorrect';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onLogin(formData.email, formData.password, formData.rememberMe);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1576669801838-1b1c52121e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwbGFib3JhdG9yeSUyMGVxdWlwbWVudCUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzU5NTg0MzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Login Card */}
      <Card className="w-full max-w-md mx-4 relative z-10 shadow-2xl border-0 bg-white rounded-xl">
        <CardHeader className="text-center pb-6 pt-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <TestTube className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            PathoSync
          </CardTitle>
          <p className="text-gray-600 text-base">
            Laboratory Management System
          </p>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className={`mt-2 h-12 ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-gray-50`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password *
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className={`pr-12 h-12 ${errors.password ? 'border-red-500' : 'border-gray-300'} bg-gray-50`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Captcha */}
            <div>
              <Label htmlFor="captcha" className="text-gray-700 font-medium">
                Captcha *
              </Label>
              <div className="flex items-center gap-3 mt-2">
                <div className="bg-gray-100 border-2 border-gray-300 px-4 py-3 rounded-md font-mono text-lg font-bold tracking-wider text-center min-w-[120px] select-none text-gray-800">
                  {captchaText}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateCaptcha}
                  className="p-2 border-gray-300 hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </Button>
                <Input
                  id="captcha"
                  value={formData.captcha}
                  onChange={(e) => setFormData(prev => ({ ...prev, captcha: e.target.value }))}
                  placeholder="Enter captcha"
                  className={`flex-1 ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
                  maxLength={5}
                />
              </div>
              {errors.captcha && (
                <p className="text-red-500 text-xs mt-1">{errors.captcha}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                }
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-medium mt-6"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Accounts (Password: password123)</h4>
            <div className="space-y-1 text-xs text-blue-700">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p><strong>Basic Plan:</strong></p>
                  <p>admin@basic.com</p>
                </div>
                <div>
                  <p><strong>Starter Plan:</strong></p>
                  <p>admin@starter.com</p>
                </div>
                <div>
                  <p><strong>Professional Plan:</strong></p>
                  <p>admin@professional.com</p>
                </div>
                <div>
                  <p><strong>Enterprise Plan:</strong></p>
                  <p>admin@enterprise.com</p>
                </div>
              </div>
              <p className="text-center mt-2 font-medium">
                Try Professional/Enterprise to access Collection Centers! 🏢
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-3 pt-6 border-t border-gray-200">
            <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 text-base">
              Forgot Password?
            </Button>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-2" />
              Secure Login
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Branding */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">
        <p>© 2024 PathoSync - Laboratory Management System</p>
        <p className="text-xs mt-1">Powered by Advanced Healthcare Technology</p>
      </div>
    </div>
  );
}