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
import { Page } from '../App'; // Import Page type

interface LoginPageProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
  onNavigate: (page: Page) => void; // Add onNavigate prop
  loading?: boolean;
}

export function LoginPage({ onLogin, onNavigate, loading = false }: LoginPageProps) {
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
            {/* ... (form fields) ... */}
          </form>

          {/* ... (Demo Credentials) ... */}

          {/* Footer Links */}
          <div className="text-center space-y-3 pt-6 border-t border-gray-200">
            <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 text-base">
              Forgot Password?
            </Button>
            <div>
                <Button variant="link" onClick={() => onNavigate('signup')} className="text-blue-600 hover:text-blue-700 p-0 text-base">
                    Don't have an account? Sign Up
                </Button>
            </div>
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