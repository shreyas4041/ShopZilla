import React from 'react';
import { useState, createContext, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProfilePage from './pages/SellerProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import FaqPage from './pages/FaqPage';
import { ToastProvider } from './components/Toast';

import * as api from './api';
import type { User, Product, CartItem, Order, Promotion, Review, Settings, PayoutRequest, Transaction, TaxLedgerEntry, ReturnRequest, Question, Answer, PlatformTransaction } from './types';

// --- Contexts ---
interface AppContextType {
  isLoading: boolean;
}
export const AppContext = createContext<AppContextType>({ isLoading: true });

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, pass: string) => Promise<User | null>;
  signup: (name: string, email: string, phone: string, pass: string, role: 'customer' | 'seller') => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  changePassword: (userId: string, currentPass: string, newPass: string) => Promise<void>;
  requestPayout: (sellerId: string, amount: number) => Promise<void>;
}
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface CartContextType {
  cart: CartItem[];
  savedItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (productId: number) => void;
  moveToCart: (productId: number) => void;
  removeSavedItem: (productId: number) => void;
}
export const CartContext = createContext<CartContextType>({} as CartContextType);

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'status' | 'reviews' | 'rating' | 'questions'>) => Promise<void>;
  updateProduct: (updatedProduct: Product) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  addProductReview: (productId: number, review: Omit<Review, 'date'>) => Promise<void>;
  addProductQuestion: (productId: number, question: Omit<Question, 'id' | 'date' | 'answer'>) => Promise<void>;
  addProductAnswer: (productId: number, questionId: string, answer: Omit<Answer, 'date'>) => Promise<void>;
}
export const ProductContext = createContext<ProductContextType>({} as ProductContextType);

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'subtotal' | 'tax' | 'platformFee' | 'total' | 'sellerEarnings' | 'adminEarnings' | 'shippingFee'>) => Promise<void>;
  updateOrder: (updatedOrder: Order) => Promise<void>;
}
export const OrderContext = createContext<OrderContextType>({} as OrderContextType);

interface PromotionContextType {
    promotions: Promotion[];
    addPromotion: (promo: Omit<Promotion, 'id'>) => Promise<void>;
    updatePromotion: (promo: Promotion) => Promise<void>;
    deletePromotion: (promoId: string) => Promise<void>;
}
export const PromotionContext = createContext<PromotionContextType>({} as PromotionContextType);

interface WishlistContextType {
  wishlist: number[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isProductInWishlist: (productId: number) => boolean;
}
export const WishlistContext = createContext<WishlistContextType>({} as WishlistContextType);

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}
export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

interface SettingsContextType {
    settings: Settings | null;
    updateSettings: (settings: Settings) => Promise<void>;
}
export const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

interface FinancialContextType {
    payoutRequests: PayoutRequest[];
    transactions: Transaction[];
    platformTransactions: PlatformTransaction[];
    taxLedger: TaxLedgerEntry[];
    returnRequests: ReturnRequest[];
    addReturnRequest: (orderId: string, userId: string, reason: string) => Promise<void>;
    processReturnRequest: (requestId: string, action: 'approve' | 'reject') => Promise<void>;
    processPayoutRequest: (requestId: string, action: 'approve' | 'reject') => Promise<void>;
    markTaxAsRemitted: (taxEntryId: string) => Promise<void>;
    withdrawPlatformFunds: (amount: number) => Promise<void>;
}
export const FinancialContext = createContext<FinancialContextType>({} as FinancialContextType);

// --- Context Provider Component ---
const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('shopzillaTheme') || 'dark');
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('shopzillaUser') || 'null'));
  const [cart, setCart] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('shopzillaCart') || '[]'));
  const [savedItems, setSavedItems] = useState<CartItem[]>(() => JSON.parse(localStorage.getItem('shopzillaSavedItems') || '[]'));
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [platformTransactions, setPlatformTransactions] = useState<PlatformTransaction[]>([]);
  const [taxLedger, setTaxLedger] = useState<TaxLedgerEntry[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  
  const navigate = useNavigate();

  // Initial Data Fetching Effect
  const fetchData = useCallback(() => {
    setIsLoading(true);
    api.initializeData().then(() => {
        Promise.all([
            api.fetchUsers().then(setUsers),
            api.fetchProducts().then(setProducts),
            api.fetchOrders().then(setOrders),
            api.fetchPromotions().then(setPromotions),
            api.fetchSettings().then(setSettings),
            api.fetchPayoutRequests().then(setPayoutRequests),
            api.fetchTransactions().then(setTransactions),
            api.fetchPlatformTransactions().then(setPlatformTransactions),
            api.fetchTaxLedger().then(setTaxLedger),
            api.fetchReturnRequests().then(setReturnRequests),
        ]).finally(() => {
            setIsLoading(false);
        });
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Persistence Effects
  useEffect(() => { localStorage.setItem('shopzillaTheme', theme); document.documentElement.className = theme; }, [theme]);
  useEffect(() => { user ? localStorage.setItem('shopzillaUser', JSON.stringify(user)) : localStorage.removeItem('shopzillaUser'); }, [user]);
  useEffect(() => { localStorage.setItem('shopzillaCart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('shopzillaSavedItems', JSON.stringify(savedItems)); }, [savedItems]);
  
  // --- Auth ---
  const login = async (email: string, pass: string): Promise<User | null> => {
      try {
        const loggedInUser = await api.login(email, pass);
        setUser(loggedInUser);
        return loggedInUser;
      } catch (error) {
        console.error("Login failed:", error);
        return null;
      }
  };

  const signup = async (name: string, email: string, phone: string, pass: string, role: 'customer' | 'seller'): Promise<boolean> => {
      try {
          const newUser = await api.signup(name, email, phone, pass, role);
          setUser(newUser);
          setUsers(await api.fetchUsers());
          return true;
      } catch (error) {
          console.error("Signup failed:", error);
          return false;
      }
  };

  const logout = useCallback(() => { setUser(null); navigate('/'); }, [navigate]);
  const updateUser = async (updatedUser: User) => {
      await api.updateUser(updatedUser);
      const updatedUsers = await api.fetchUsers();
      setUsers(updatedUsers);
      if(user?.id === updatedUser.id) {
          const currentlyLoggedInUser = updatedUsers.find(u => u.id === user.id)
          setUser(currentlyLoggedInUser || null);
      }
  };
  const deleteUser = async (userId: string) => {
      await api.deleteUser(userId);
      setUsers(await api.fetchUsers());
  };
   const changePassword = async (userId: string, currentPass: string, newPass: string) => {
    await api.changePassword(userId, currentPass, newPass);
  };
  const requestPayout = async (sellerId: string, amount: number) => {
      await api.requestPayout(sellerId, amount);
      fetchData(); // Refetch all data to ensure consistency
  };
  
  // --- Cart ---
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { ...product, quantity }];
    });
  }, []);
  const removeFromCart = useCallback((productId: number) => { setCart(prev => prev.filter(item => item.id !== productId)); }, []);
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) { removeFromCart(productId); return; }
    setCart(prev => prev.map(item => (item.id === productId ? { ...item, quantity } : item)));
  }, [removeFromCart]);
  const clearCart = useCallback(() => { setCart([]); }, []);
  const saveForLater = useCallback((productId: number) => {
    const itemToSave = cart.find(item => item.id === productId);
    if (itemToSave) {
        setSavedItems(prev => [...prev, itemToSave]);
        setCart(prev => prev.filter(item => item.id !== productId));
    }
  }, [cart]);
  const moveToCart = useCallback((productId: number) => {
    const itemToMove = savedItems.find(item => item.id === productId);
    if (itemToMove) {
        addToCart(itemToMove, itemToMove.quantity);
        setSavedItems(prev => prev.filter(item => item.id !== productId));
    }
  }, [savedItems, addToCart]);
  const removeSavedItem = useCallback((productId: number) => { setSavedItems(prev => prev.filter(item => item.id !== productId)); }, []);

  // --- Product ---
  const addProduct = async (product: Omit<Product, 'id' | 'status' | 'reviews' | 'rating' | 'questions'>) => {
    await api.addProduct(product); setProducts(await api.fetchProducts());
  };
  const updateProduct = async (updatedProduct: Product) => {
    await api.updateProduct(updatedProduct); setProducts(await api.fetchProducts());
  };
  const deleteProduct = async (productId: number) => {
    await api.deleteProduct(productId); setProducts(await api.fetchProducts());
  };
  const addProductReview = async (productId: number, review: Omit<Review, 'date'>) => {
    await api.addProductReview(productId, review); setProducts(await api.fetchProducts());
  };
  const addProductQuestion = async (productId: number, question: Omit<Question, 'id' | 'date' | 'answer'>) => {
    await api.addProductQuestion(productId, question); setProducts(await api.fetchProducts());
  }
  const addProductAnswer = async (productId: number, questionId: string, answer: Omit<Answer, 'date'>) => {
    await api.addProductAnswer(productId, questionId, answer); setProducts(await api.fetchProducts());
  }

  // --- Order ---
  const addOrder = async (order: Omit<Order, 'id' | 'date' | 'subtotal' | 'tax' | 'platformFee' | 'total' | 'sellerEarnings' | 'adminEarnings' | 'shippingFee'>) => { 
    await api.addOrder(order);
    fetchData(); // Refetch all to update balances, transactions, etc.
  };
   const updateOrder = async (order: Order) => { 
    await api.updateOrder(order); setOrders(await api.fetchOrders());
  };

  // --- Promotion ---
  const addPromotion = async (promo: Omit<Promotion, 'id'>) => {
      await api.addPromotion(promo); setPromotions(await api.fetchPromotions());
  };
  const updatePromotion = async (promo: Promotion) => {
      await api.updatePromotion(promo); setPromotions(await api.fetchPromotions());
  };
  const deletePromotion = async (promoId: string) => {
      await api.deletePromotion(promoId); setPromotions(await api.fetchPromotions());
  };

  // --- Wishlist ---
  const wishlist = user?.wishlist || [];
  const isProductInWishlist = useCallback((productId: number) => wishlist.includes(productId), [wishlist]);
  const addToWishlist = useCallback(async (productId: number) => {
    if (!user || isProductInWishlist(productId)) return;
    await updateUser({ ...user, wishlist: [...wishlist, productId] });
  }, [user, wishlist, isProductInWishlist, updateUser]);
  const removeFromWishlist = useCallback(async (productId: number) => {
    if (!user || !isProductInWishlist(productId)) return;
    await updateUser({ ...user, wishlist: wishlist.filter(id => id !== productId) });
  }, [user, wishlist, isProductInWishlist, updateUser]);

  // --- Theme ---
  const toggleTheme = useCallback(() => { setTheme(prev => (prev === 'light' ? 'dark' : 'light')); }, []);

  // --- Settings ---
  const updateSettings = async (newSettings: Settings) => {
    await api.updateSettings(newSettings); setSettings(await api.fetchSettings());
  }

  // --- Financials ---
  const addReturnRequest = async (orderId: string, userId: string, reason: string) => {
    await api.addReturnRequest(orderId, userId, reason); fetchData();
  }
  const processReturnRequest = async (requestId: string, action: 'approve' | 'reject') => {
    await api.processReturnRequest(requestId, action); fetchData();
  }
  const processPayoutRequest = async (requestId: string, action: 'approve' | 'reject') => {
    await api.processPayoutRequest(requestId, action); fetchData();
  }
  const markTaxAsRemitted = async (taxEntryId: string) => {
    await api.markTaxAsRemitted(taxEntryId); setTaxLedger(await api.fetchTaxLedger());
  }
  const withdrawPlatformFunds = async (amount: number) => {
    await api.withdrawPlatformFunds(amount);
    fetchData(); // Refetch to update platform balance and transactions
  }

  return (
    <AppContext.Provider value={{ isLoading }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
       <SettingsContext.Provider value={{ settings, updateSettings }}>
        <AuthContext.Provider value={{ user, users, login, signup, logout, updateUser, deleteUser, changePassword, requestPayout }}>
         <FinancialContext.Provider value={{ payoutRequests, transactions, platformTransactions, taxLedger, returnRequests, addReturnRequest, processReturnRequest, processPayoutRequest, markTaxAsRemitted, withdrawPlatformFunds }}>
          <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, addProductReview, addProductQuestion, addProductAnswer }}>
            <CartContext.Provider value={{ cart, savedItems, addToCart, removeFromCart, updateQuantity, clearCart, saveForLater, moveToCart, removeSavedItem }}>
              <OrderContext.Provider value={{ orders, addOrder, updateOrder }}>
              <PromotionContext.Provider value={{ promotions, addPromotion, updatePromotion, deletePromotion }}>
                <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isProductInWishlist }}>
                  {children}
                </WishlistContext.Provider>
              </PromotionContext.Provider>
              </OrderContext.Provider>
            </CartContext.Provider>
          </ProductContext.Provider>
         </FinancialContext.Provider>
        </AuthContext.Provider>
       </SettingsContext.Provider>
      </ThemeContext.Provider>
    </AppContext.Provider>
  );
};

const AppRoutes = () => {
    return (
        <div className={`flex flex-col min-h-screen bg-white dark:bg-primary transition-colors duration-300`}>
            <Header />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<ProtectedRoute roles={['customer', 'seller', 'admin']}><CheckoutPage /></ProtectedRoute>} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/profile" element={<ProtectedRoute roles={['customer', 'seller', 'admin']}><ProfilePage /></ProtectedRoute>} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/shipping" element={<ShippingPage />} />
                    <Route path="/returns" element={<ReturnsPage />} />
                    <Route path="/faq" element={<FaqPage />} />

                    <Route path="/sellers/:sellerId" element={<SellerProfilePage />} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/seller/dashboard" element={<ProtectedRoute roles={['seller', 'admin']}><SellerDashboard /></ProtectedRoute>} />
                    
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

const App: React.FC = () => {
  return (
    <HashRouter>
        <AppContextProvider>
         <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AppContextProvider>
    </HashRouter>
  );
};

export default App;
