import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext, AuthContext } from '../App';
import { Button, Card } from '../components/ui';
import QuantitySelector from '../components/QuantitySelector';

const EmptyCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);


const CartPage: React.FC = () => {
  const { cart, savedItems, removeFromCart, updateQuantity, clearCart, saveForLater, moveToCart, removeSavedItem } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect admin away from customer-specific pages
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);


  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
      if (user) {
          navigate('/checkout');
      } else {
          navigate('/auth');
      }
  };

  if (cart.length === 0 && savedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <EmptyCartIcon />
        <h1 className="text-4xl font-bold mt-6 mb-4 text-textDark dark:text-textLight">Your Cart is Empty</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-textDark dark:text-textLight">Your Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-8">
          {cart.length > 0 ? (
            <Card>
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-textDark dark:text-textLight">Cart Items ({cart.length})</h2>
                    <button onClick={clearCart} className="text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors">Clear Cart</button>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cart.map(item => (
                    <div key={item.id} className="flex items-center p-6">
                    <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" loading="lazy" />
                    <div className="flex-grow ml-4">
                        <h3 className="text-lg font-semibold text-textDark dark:text-textLight">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.brand}</p>
                        <div className="flex gap-4 text-sm mt-1">
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-500 dark:text-gray-400 hover:text-accent transition-colors">Remove</button>
                            <button onClick={() => saveForLater(item.id)} className="text-gray-500 dark:text-gray-400 hover:text-accent transition-colors">Save for later</button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <QuantitySelector 
                            quantity={item.quantity}
                            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                            onDecrease={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                        />
                    </div>
                    <div className="text-right w-24 ml-4">
                        <p className="font-semibold text-textDark dark:text-textLight">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    </div>
                ))}
                </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
                 <EmptyCartIcon />
                <h2 className="text-2xl font-bold mt-4 mb-2 text-textDark dark:text-textLight">Your active cart is empty</h2>
                <p className="text-gray-500">Check your "Saved for Later" items below.</p>
            </Card>
          )}

          {savedItems.length > 0 && (
             <Card>
                <h2 className="text-xl font-semibold text-textDark dark:text-textLight px-6 py-4 border-b border-gray-200 dark:border-gray-700">Saved For Later ({savedItems.length})</h2>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {savedItems.map(item => (
                         <div key={item.id} className="flex items-center p-6">
                            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" loading="lazy" />
                            <div className="flex-grow ml-4">
                                <h3 className="text-lg font-semibold text-textDark dark:text-textLight">{item.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</p>
                                <button onClick={() => removeSavedItem(item.id)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors mt-2">Remove</button>
                            </div>
                            <Button variant="outline" onClick={() => moveToCart(item.id)}>Move to Cart</Button>
                         </div>
                    ))}
                </div>
             </Card>
          )}
        </div>
        {cart.length > 0 && (
            <div className="lg:w-1/3">
            <div className="bg-white dark:bg-secondary rounded-lg shadow-lg p-6 sticky top-24 border border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-4 text-textDark dark:text-textLight">Order Summary</h2>
                <div className="space-y-4 my-6 text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-textDark dark:text-textLight border-t border-gray-200 dark:border-gray-700 pt-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                </div>
                <Button onClick={handleCheckout} className="w-full">
                Proceed to Checkout
                </Button>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;