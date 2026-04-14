

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button, Input } from '../components/ui';
import { useToast } from '../components/Toast';

type AuthMode = 'signin' | 'signup';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'seller',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const user = await login(formData.email, formData.password);
        if (!user) throw new Error('Invalid email or password.');
        
        addToast('Login successful! Welcome back.', 'success');
        
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate('/profile');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match.');
        }
        const success = await signup(formData.name, formData.email, formData.phone, formData.password, formData.role);
        if (!success) throw new Error('User with this email already exists.');
        
        addToast('Account created successfully! Welcome.', 'success');

        if(formData.role === 'seller') {
            navigate('/seller/dashboard');
        } else {
            navigate('/profile');
        }
      }
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-accent">Welcome to ShopZilla</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Your premium shopping destination</p>
        </div>
        
        <div className="bg-white dark:bg-secondary p-8 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-center mb-2 text-textDark dark:text-textLight">Get Started</h3>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">Sign in to your account or create a new one.</p>

            <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-primary p-1 rounded-md mb-6">
                <button onClick={() => setMode('signin')} className={`px-4 py-2 text-sm font-semibold rounded ${mode === 'signin' ? 'bg-accent text-white' : 'text-gray-600 dark:text-gray-300'}`}>Sign In</button>
                <button onClick={() => setMode('signup')} className={`px-4 py-2 text-sm font-semibold rounded ${mode === 'signup' ? 'bg-accent text-white' : 'text-gray-600 dark:text-gray-300'}`}>Sign Up</button>
            </div>
          
            <form className="space-y-4" onSubmit={handleSubmit}>
                {mode === 'signup' && (
                    <>
                        <Input id="name" name="name" type="text" label="Full Name" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} required />
                        <Input id="phone" name="phone" type="tel" label="Phone (Optional)" placeholder="Enter your phone number" value={formData.phone} onChange={handleInputChange} />
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">I want to:</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors ${formData.role === 'customer' ? 'bg-accent/10 border-accent' : 'border-gray-300 dark:border-gray-600'}`}>
                                    <input type="radio" name="role" value="customer" checked={formData.role === 'customer'} onChange={handleInputChange} className="sr-only" />
                                    <span className="font-semibold text-textDark dark:text-textLight">Shop Products</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Create a customer account.</p>
                                </label>
                                <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors ${formData.role === 'seller' ? 'bg-accent/10 border-accent' : 'border-gray-300 dark:border-gray-600'}`}>
                                    <input type="radio" name="role" value="seller" checked={formData.role === 'seller'} onChange={handleInputChange} className="sr-only" />
                                    <span className="font-semibold text-textDark dark:text-textLight">Sell Products</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Create a seller account.</p>
                                </label>
                            </div>
                        </div>
                    </>
                )}
                
                <Input id="email" name="email" type="email" label="Email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} required />
                <Input id="password" name="password" type="password" label="Password" placeholder="Enter your password" value={formData.password} onChange={handleInputChange} required />

                {mode === 'signup' && (
                     <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleInputChange} required />
                )}
                
                {error && <p className="text-red-500 text-xs text-center pt-2">{error}</p>}

                <div className="pt-4">
                  <Button type="submit" className="w-full justify-center py-3" disabled={isLoading}>
                    {isLoading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                  </Button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;