import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext, AuthContext, OrderContext, ThemeContext, SettingsContext } from '../App';
import { Button, Input, Card, Spinner } from '../components/ui';
import { useToast } from '../components/Toast';
import type { Order } from '../types';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51PK68dRxzrg2sD4A3sVXd6aQ8V6L9aBhm5q6d1fQoO4G01pQ0L4nU2Cq4N9g0Z5b3S7X7b3X6c9Z3d4F00y2a3Q4b5'; // Placeholder test key

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addOrder } = useContext(OrderContext);
  const { theme } = useContext(ThemeContext);
  const { settings } = useContext(SettingsContext);
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    street: user?.addresses[0]?.street || '',
    city: user?.addresses[0]?.city || '',
    state: user?.addresses[0]?.state || '',
    zip: user?.addresses[0]?.zip || '',
    country: 'USA'
  });
  
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Card');
  const [stripe, setStripe] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const cardElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.role === 'admin') { navigate('/admin/dashboard'); return; }
    if (!user) { navigate('/auth'); }
    if (cart.length === 0) { navigate('/cart'); }
  }, [user, cart, navigate]);
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * ((settings?.taxPercentage || 0) / 100);
  const total = subtotal + tax + (settings?.shippingFee || 0);
  const canPayWithBalance = (user?.balance || 0) >= total;

  useEffect(() => {
    if (canPayWithBalance) {
        setPaymentMethod('Balance');
    } else {
        setPaymentMethod('Card');
    }
  }, [canPayWithBalance]);

  useEffect(() => {
    if (paymentMethod === 'Card' && (window as any).Stripe) {
        const stripeInstance = (window as any).Stripe(STRIPE_PUBLISHABLE_KEY);
        setStripe(stripeInstance);
        const elements = stripeInstance.elements();
        const style = {
            base: { color: theme === 'dark' ? '#F3F4F6' : '#111827', fontFamily: '"Helvetica Neue", Helvetica, sans-serif', fontSmoothing: 'antialiased', fontSize: '16px', '::placeholder': { color: theme === 'dark' ? '#6B7280' : '#A1A1AA' } },
            invalid: { color: '#ef4444', iconColor: '#ef4444' },
        };
        const card = elements.create('card', { style });
        if(cardElementRef.current) { card.mount(cardElementRef.current); }
        setCardElement(card);
        return () => { card.destroy(); }
    }
  }, [theme, paymentMethod]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsProcessing(true);
    setPaymentError(null);

    if (paymentMethod === 'Card') {
      if (!stripe || !cardElement) {
        setPaymentError('Stripe is not ready.');
        setIsProcessing(false);
        return;
      }
      const { error } = await stripe.createPaymentMethod({ type: 'card', card: cardElement, billing_details: { name: shippingInfo.name, email: user.email }});
      if (error) {
        setPaymentError(error.message || 'An unexpected error occurred.');
        setIsProcessing(false);
        return;
      }
    }

    try {
        const { name, ...addressFields } = shippingInfo;
        await addOrder({
            userId: user.id,
            items: cart,
            shippingAddress: { id: 'addr' + Date.now(), ...addressFields },
            status: 'Pending',
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === 'COD' ? 'Unpaid' : 'Paid'
        });
        clearCart();
        addToast('Order placed successfully!', 'success');
        navigate('/profile');
    } catch(err: any) {
        addToast(err.message || 'There was an issue placing your order.', 'error');
    } finally {
        setIsProcessing(false);
    }
  };

  if (!settings) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center text-textDark dark:text-textLight">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-textDark dark:text-textLight">Shipping Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" name="name" id="name" value={shippingInfo.name} onChange={handleShippingChange} required />
              <Input label="Street Address" name="street" id="street" value={shippingInfo.street} onChange={handleShippingChange} required />
              <Input label="City" name="city" id="city" value={shippingInfo.city} onChange={handleShippingChange} required />
              <Input label="State" name="state" id="state" value={shippingInfo.state} onChange={handleShippingChange} required />
              <Input label="ZIP Code" name="zip" id="zip" value={shippingInfo.zip} onChange={handleShippingChange} required />
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-textDark dark:text-textLight">Payment Method</h2>
            {(user?.balance || 0) > 0 && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">Your available ShopZilla Balance: <span className="font-bold">${user?.balance?.toFixed(2)}</span></p>
                </div>
            )}
            <div className="space-y-4">
               <div className="flex gap-4">
                    {canPayWithBalance && (
                         <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'Balance' ? 'bg-accent/10 border-accent' : 'border-gray-300 dark:border-gray-600'}`}>
                            <input type="radio" name="paymentMethod" value="Balance" checked={paymentMethod === 'Balance'} onChange={() => setPaymentMethod('Balance')} className="sr-only" />
                            <span className="font-semibold text-textDark dark:text-textLight">Use ShopZilla Balance</span>
                            <p className="text-xs text-gray-500">Available: ${user?.balance?.toFixed(2)}</p>
                        </label>
                    )}
                    {['Card', 'UPI', 'COD'].map(method => (
                        <label key={method} className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === method ? 'bg-accent/10 border-accent' : 'border-gray-300 dark:border-gray-600'} ${canPayWithBalance ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method as Order['paymentMethod'])} className="sr-only" disabled={canPayWithBalance} />
                            <span className="font-semibold text-textDark dark:text-textLight">{method}</span>
                        </label>
                    ))}
                </div>

              {paymentMethod === 'Card' && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Credit or Debit Card</label>
                  <div className="block w-full px-4 py-3 border rounded-md shadow-sm bg-white dark:bg-primary border-gray-300 dark:border-gray-600 focus-within:ring-accent focus-within:border-accent">
                      <div ref={cardElementRef} />
                  </div>
                </div>
              )}
               {paymentMethod === 'UPI' && <p className="text-sm text-gray-500">You will be redirected to your UPI app to complete the payment. (Simulation)</p>}
               {paymentMethod === 'COD' && <p className="text-sm text-gray-500">You can pay with cash when your order is delivered.</p>}
               {paymentMethod === 'Balance' && <p className="text-sm text-green-600 dark:text-green-400">Your order will be paid for using your available balance.</p>}
              {paymentError && <p className="text-red-500 text-sm mt-2">{paymentError}</p>}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-4 text-textDark dark:text-textLight">Your Order</h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 my-4">
              {cart.map(item => (
                <li key={item.id} className="py-2 flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-medium text-textDark dark:text-textLight">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4 text-gray-600 dark:text-gray-300">
              <div className="flex justify-between text-sm"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span>Shipping:</span> <span>${settings.shippingFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span>Tax ({settings.taxPercentage}%):</span> <span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg text-textDark dark:text-textLight"><span>Total:</span> <span>${total.toFixed(2)}</span></div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isProcessing || (paymentMethod === 'Card' && !stripe)}>
              {isProcessing ? ( <><Spinner className="h-5 w-5 mr-2 border-t-white border-b-white border-accent"/> Processing...</> ) : 'Place Order'}
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
