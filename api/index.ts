// Fix: Created this file to provide a mock API layer and resolve the module import error in App.tsx.

import { products as initialProducts, promotions as initialPromotions } from '../data';
import type { User, Product, CartItem, Order, Promotion, Review, Settings, PayoutRequest, Transaction, TaxLedgerEntry, ReturnRequest, Question, Answer, PlatformTransaction, Address } from '../types';

// Fix: Define an internal DBUser type to prevent TypeScript from inferring literal types
// for properties like `isVerified`, which caused assignment errors.
type DBUser = User & { passwordHash: string };

// --- MOCK DATABASE (using localStorage) ---
const DB_KEY = 'shopzillaDB';

const defaultDB = {
    users: [
        { id: 'admin-user', name: 'Admin User', email: 'admin@shopzilla.com', phone: '1234567890', role: 'admin', passwordHash: '123456', addresses: [], wishlist: [], balance: 0 },
        { id: 'seller-user', name: 'Top Tech Seller', email: 'seller@shopzilla.com', phone: '1234567890', role: 'seller', passwordHash: '123456', addresses: [{ id: 'addr-seller', street: '123 Seller St', city: 'Sellerville', state: 'CA', zip: '90210', country: 'USA' }], wishlist: [], balance: 750.50, sellerStatus: 'approved', payoutInfo: { bankName: 'Bank of Sellers', accountHolder: 'Top Tech Seller', accountNumber: '1234567890' } },
        { id: 'customer-user', name: 'Regular Customer', email: 'customer@shopzilla.com', phone: '1234567890', role: 'customer', passwordHash: '123456', addresses: [{ id: 'addr-customer', street: '456 Customer Ave', city: 'Buyington', state: 'NY', zip: '10001', country: 'USA' }], wishlist: [2, 3], balance: 50.00 },
        { id: 'seller-pending-1680000000000', name: 'Fashion Forward', email: 'fashion@shopzilla.com', phone: '1112223333', role: 'seller', passwordHash: '123456', addresses: [], wishlist: [], balance: 0, sellerStatus: 'pending', payoutInfo: { bankName: '', accountHolder: '', accountNumber: '' } },
        { id: 'seller-pending-1690000000000', name: 'Home Goods Hub', email: 'home@shopzilla.com', phone: '4445556666', role: 'seller', passwordHash: '123456', addresses: [], wishlist: [], balance: 0, sellerStatus: 'pending', payoutInfo: { bankName: '', accountHolder: '', accountNumber: '' } },
        { id: 'seller-rejected-1670000000000', name: 'Rejected Seller Co', email: 'rejected@shopzilla.com', phone: '7778889999', role: 'seller', passwordHash: '123456', addresses: [], wishlist: [], balance: 0, sellerStatus: 'rejected', payoutInfo: { bankName: '', accountHolder: '', accountNumber: '' } },
        { id: 'seller-approved-1700000000000', name: 'Book Nook', email: 'books@shopzilla.com', phone: '3334445555', role: 'seller', passwordHash: '123456', addresses: [], wishlist: [], balance: 250.00, sellerStatus: 'approved', payoutInfo: { bankName: 'First Digital Bank', accountHolder: 'Book Nook LLC', accountNumber: '0987654321' } },
        { id: 'seller-fashion-approved', name: 'Chic Boutique', email: 'chic@shopzilla.com', phone: '1212121212', role: 'seller', passwordHash: '123456', addresses: [], wishlist: [], balance: 1200.00, sellerStatus: 'approved', payoutInfo: { bankName: 'Fashion Bank', accountHolder: 'Chic Boutique', accountNumber: '1122334455' } },

    ] as DBUser[],
    products: [
        ...initialProducts.map(p => ({ ...p, status: 'approved', questions: [], reviews: p.reviews || [] }) as Product),
        { id: 101, name: 'Advanced Drone', category: 'Electronics', categories: { main: 'Electronics', sub: 'Cameras & Drones', type: 'Drones', gender: 'Unisex', ageGroup: 'Adult' }, price: 499.99, brand: 'FlyHigh', description: 'A professional-grade drone with 4K camera.', imageUrl: 'https://picsum.photos/seed/drone/400/400', images: ['https://picsum.photos/seed/drone/400/400'], rating: 0, reviews: [], stock: 15, sellerId: 'seller-user', status: 'pending', questions: [] },
        { id: 102, name: 'Handcrafted Vase', category: 'Home & Kitchen', categories: { main: 'Home & Kitchen', sub: 'Home Decor', type: 'Vases', gender: 'Unisex', ageGroup: 'Adult' }, price: 75.00, brand: 'Artisan Home', description: 'A beautiful, unique vase for your home decor.', imageUrl: 'https://picsum.photos/seed/vase/400/400', images: ['https://picsum.photos/seed/vase/400/400'], rating: 0, reviews: [], stock: 25, sellerId: 'seller-approved-1700000000000', status: 'pending', questions: [] },
        { id: 103, name: 'Ergonomic Office Chair', category: 'Home & Kitchen', categories: { main: 'Home & Kitchen', sub: 'Furniture', type: 'Chairs', gender: 'Unisex', ageGroup: 'Adult' }, price: 250.00, brand: 'ComfySeat', description: 'A chair that is good for your back.', imageUrl: 'https://picsum.photos/seed/chair/400/400', images: ['https://picsum.photos/seed/chair/400/400'], rating: 0, reviews: [], stock: 30, sellerId: 'seller-user', status: 'rejected', questions: [] },
        { id: 104, name: 'Boutique Silk Scarf', category: 'Fashion', categories: { main: 'Fashion', sub: 'Accessories', type: 'Scarves', gender: 'Women', ageGroup: 'Adult' }, price: 65.00, brand: 'Silky Smooth', description: 'A luxurious 100% silk scarf.', imageUrl: 'https://picsum.photos/seed/scarf/400/400', images: ['https://picsum.photos/seed/scarf/400/400'], rating: 0, reviews: [], stock: 50, sellerId: 'seller-pending-1680000000000', status: 'pending', questions: [] },
        { id: 13, name: 'Floral Summer Dress', category: 'Fashion', categories: { main: 'Fashion', sub: 'Women\'s Apparel', type: 'Dresses', gender: 'Women', ageGroup: 'Adult' }, price: 79.99, brand: 'StyleStitch', description: 'A light and airy dress perfect for summer days.', imageUrl: 'https://picsum.photos/seed/dress/400/400', rating: 4.8, reviews: [], stock: 60, sellerId: 'seller-fashion-approved', status: 'approved', questions: [] },
        { id: 14, name: 'Dinosaur Graphic T-Shirt', category: 'Fashion', categories: { main: 'Fashion', sub: 'Kids\' Apparel', type: 'T-Shirts', gender: 'Unisex', ageGroup: 'Kids' }, price: 24.99, brand: 'KidVenture', description: 'A fun and comfortable t-shirt for your little explorer.', imageUrl: 'https://picsum.photos/seed/kids-shirt/400/400', rating: 4.9, reviews: [], stock: 150, sellerId: 'seller-fashion-approved', status: 'approved', questions: [] },
    ] as Product[],
    orders: [
        {
            id: 'o1700000000000', date: new Date(Date.now() - 86400000 * 5).toISOString(), userId: 'customer-user',
            items: [
                { ...(initialProducts.find(p => p.id === 1)! as Product), status: 'approved', quantity: 1, sellerId: 'seller-user' },
                { ...(initialProducts.find(p => p.id === 3)! as Product), status: 'approved', quantity: 1, sellerId: 'seller-user' },
            ],
            shippingAddress: { id: 'addr-customer', street: '456 Customer Ave', city: 'Buyington', state: 'NY', zip: '10001', country: 'USA' }, status: 'Delivered', paymentMethod: 'Card', paymentStatus: 'Paid',
            subtotal: 849.98, shippingFee: 5.99, tax: 68.00, platformFee: 85.00, total: 923.97,
            sellerEarnings: [{ sellerId: 'seller-user', amount: 764.98 }], adminEarnings: 85.00, trackingNumber: 'TN123456789'
        },
        {
            id: 'o1710000000000', date: new Date(Date.now() - 86400000 * 3).toISOString(), userId: 'customer-user',
            items: [ { ...(initialProducts.find(p => p.id === 5)! as Product), status: 'approved', quantity: 1, sellerId: 'seller-approved-1700000000000' } ],
            shippingAddress: { id: 'addr-customer', street: '456 Customer Ave', city: 'Buyington', state: 'NY', zip: '10001', country: 'USA' }, status: 'Shipped', paymentMethod: 'Balance', paymentStatus: 'Paid',
            subtotal: 49.99, shippingFee: 5.99, tax: 4.00, platformFee: 5.00, total: 59.98,
            sellerEarnings: [{ sellerId: 'seller-approved-1700000000000', amount: 44.99 }], adminEarnings: 5.00, trackingNumber: 'TN987654321'
        },
        {
            id: 'o1720000000000', date: new Date(Date.now() - 86400000 * 1).toISOString(), userId: 'customer-user',
            items: [ { ...(initialProducts.find(p => p.id === 9)! as Product), status: 'approved', quantity: 2, sellerId: 'seller-user' } ],
            shippingAddress: { id: 'addr-customer', street: '456 Customer Ave', city: 'Buyington', state: 'NY', zip: '10001', country: 'USA' }, status: 'Processing', paymentMethod: 'Card', paymentStatus: 'Paid',
            subtotal: 179.98, shippingFee: 5.99, tax: 14.40, platformFee: 18.00, total: 200.37,
            sellerEarnings: [{ sellerId: 'seller-user', amount: 161.98 }], adminEarnings: 18.00, trackingNumber: ''
        }
    ] as Order[],
    promotions: initialPromotions,
    settings: { taxPercentage: 8, shippingFee: 5.99, platformFeePercentage: 10, platformPayoutInfo: { bankName: 'Bank of ShopZilla', accountHolder: 'ShopZilla Inc.', accountNumber: '9876543210' } } as Settings,
    payoutRequests: [
        { id: 'pr1700000000000', sellerId: 'seller-user', amount: 50.00, requestDate: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'pending' },
        { id: 'pr1710000000000', sellerId: 'seller-user', amount: 200.00, requestDate: new Date(Date.now() - 86400000 * 10).toISOString(), processedDate: new Date(Date.now() - 86400000 * 8).toISOString(), status: 'completed' },
        { id: 'pr1720000000000', sellerId: 'seller-approved-1700000000000', amount: 150.00, requestDate: new Date(Date.now() - 86400000 * 1).toISOString(), status: 'pending' },
        { id: 'pr1730000000000', sellerId: 'seller-fashion-approved', amount: 1000.00, requestDate: new Date(Date.now() - 86400000 * 4).toISOString(), status: 'pending' },
    ] as PayoutRequest[],
    transactions: [
        { id: 't1700000000000', userId: 'seller-user', date: new Date(Date.now() - 86400000 * 5).toISOString(), type: 'Earning', description: 'Sale from order #000000', amount: 764.98, orderId: 'o1700000000000' },
        { id: 't1710000000000', userId: 'customer-user', date: new Date(Date.now() - 86400000 * 3).toISOString(), type: 'Purchase', description: 'Order #000000', amount: -59.98, orderId: 'o1710000000000' },
        { id: 't1710000000001', userId: 'seller-approved-1700000000000', date: new Date(Date.now() - 86400000 * 3).toISOString(), type: 'Earning', description: 'Sale from order #000000', amount: 44.99, orderId: 'o1710000000000' },
        { id: 't1720000000000', userId: 'seller-user', date: new Date(Date.now() - 86400000 * 1).toISOString(), type: 'Earning', description: 'Sale from order #000000', amount: 161.98, orderId: 'o1720000000000' },
        { id: 't1710000000002', userId: 'seller-user', date: new Date(Date.now() - 86400000 * 8).toISOString(), type: 'Payout', description: 'Payout approved', amount: -200.00 },
    ] as Transaction[],
    platformTransactions: [
        { id: 'pt1700000000000', date: new Date(Date.now() - 86400000 * 5).toISOString(), type: 'Fee', description: 'Platform fee for order #000000', amount: 85.00, orderId: 'o1700000000000' },
        { id: 'pt1710000000000', date: new Date(Date.now() - 86400000 * 3).toISOString(), type: 'Fee', description: 'Platform fee for order #000000', amount: 5.00, orderId: 'o1710000000000' },
        { id: 'pt1720000000000', date: new Date(Date.now() - 86400000 * 1).toISOString(), type: 'Fee', description: 'Platform fee for order #000000', amount: 18.00, orderId: 'o1720000000000' },
    ] as PlatformTransaction[],
    taxLedger: [
        { id: 'tax1700000000000', orderId: 'o1700000000000', date: new Date(Date.now() - 86400000 * 5).toISOString(), taxAmount: 68.00, status: 'remitted' },
        { id: 'tax1710000000000', orderId: 'o1710000000000', date: new Date(Date.now() - 86400000 * 3).toISOString(), taxAmount: 4.00, status: 'collected' },
        { id: 'tax1720000000000', orderId: 'o1720000000000', date: new Date(Date.now() - 86400000 * 1).toISOString(), taxAmount: 14.40, status: 'collected' },
    ] as TaxLedgerEntry[],
    returnRequests: [
        { id: 'rr1700000000000', orderId: 'o1700000000000', userId: 'customer-user', reason: 'The smartphone was not working as expected.', requestDate: new Date(Date.now() - 86400000 * 1).toISOString(), status: 'pending' },
        { id: 'rr1710000000000', orderId: 'o1700000000000', userId: 'customer-user', reason: 'Jacket was too small.', requestDate: new Date(Date.now() - 86400000 * 4).toISOString(), status: 'approved' },
        { id: 'rr1720000000000', orderId: 'o1710000000000', userId: 'customer-user', reason: 'Changed my mind.', requestDate: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'rejected' }
    ] as ReturnRequest[],
    _sequences: {
        productId: 104,
    }
};

let db: typeof defaultDB = JSON.parse(localStorage.getItem(DB_KEY) || 'null');

const saveDB = () => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const initializeData = async () => {
    if (!db) {
        db = defaultDB;
        saveDB();
    }
    // Simulate API delay
    await new Promise(res => setTimeout(res, 500));
};

const withoutPassword = (user: any): User | null => {
    if (!user) return null;
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// --- FETCH ---
export const fetchUsers = async (): Promise<User[]> => db.users.map(u => withoutPassword(u) as User);
export const fetchProducts = async (): Promise<Product[]> => db.products;
export const fetchOrders = async (): Promise<Order[]> => db.orders;
export const fetchPromotions = async (): Promise<Promotion[]> => db.promotions;
export const fetchSettings = async (): Promise<Settings> => db.settings;
export const fetchPayoutRequests = async (): Promise<PayoutRequest[]> => db.payoutRequests;
export const fetchTransactions = async (): Promise<Transaction[]> => db.transactions;
export const fetchPlatformTransactions = async (): Promise<PlatformTransaction[]> => db.platformTransactions;
export const fetchTaxLedger = async (): Promise<TaxLedgerEntry[]> => db.taxLedger;
export const fetchReturnRequests = async (): Promise<ReturnRequest[]> => db.returnRequests;

// --- AUTH ---
export const login = async (email: string, pass: string): Promise<User | null> => {
    const user = db.users.find(u => u.email === email && u.passwordHash === pass);
    if (!user) throw new Error("Invalid credentials");
    return withoutPassword(user);
};

export const signup = async (name: string, email: string, phone: string, pass: string, role: 'customer' | 'seller'): Promise<User> => {
    if (db.users.some(u => u.email === email)) throw new Error("User already exists");
    // Fix: Create user object with conditional properties to match the inferred union type of the mock DB.
    const baseUser = {
        id: role + '-' + Date.now(),
        name,
        email,
        phone,
        role,
        passwordHash: pass,
        addresses: [],
        wishlist: [],
        balance: 0,
    };

    const newUser = role === 'seller'
        ? { ...baseUser, sellerStatus: 'pending' as const, payoutInfo: { bankName: '', accountHolder: '', accountNumber: '' } }
        : baseUser;

    db.users.push(newUser);
    saveDB();
    return withoutPassword(newUser) as User;
};

export const updateUser = async (updatedUser: User) => {
    const index = db.users.findIndex(u => u.id === updatedUser.id);
    if (index === -1) throw new Error("User not found");
    const existingUser = db.users[index];
    db.users[index] = { ...existingUser, ...updatedUser }; // Merge to keep passwordHash
    saveDB();
};

export const deleteUser = async (userId: string) => {
    db.users = db.users.filter(u => u.id !== userId);
    saveDB();
};

export const changePassword = async (userId: string, currentPass: string, newPass: string) => {
    const user = db.users.find(u => u.id === userId);
    if (!user || user.passwordHash !== currentPass) throw new Error("Incorrect current password");
    user.passwordHash = newPass;
    saveDB();
};

// --- PRODUCT ---
export const addProduct = async (product: Omit<Product, 'id' | 'status' | 'reviews' | 'rating' | 'questions'>) => {
    const newProduct: Product = {
        ...product,
        id: ++db._sequences.productId,
        status: 'pending',
        reviews: [],
        rating: 0,
        questions: [],
    };
    db.products.push(newProduct);
    saveDB();
};

export const updateProduct = async (updatedProduct: Product) => {
    const index = db.products.findIndex(p => p.id === updatedProduct.id);
    if (index === -1) throw new Error("Product not found");
    db.products[index] = updatedProduct;
    saveDB();
};

export const deleteProduct = async (productId: number) => {
    db.products = db.products.filter(p => p.id !== productId);
    saveDB();
};

export const addProductReview = async (productId: number, review: Omit<Review, 'date'>) => {
    const product = db.products.find(p => p.id === productId);
    if (!product) throw new Error("Product not found");

    const newReview: Review = {
        ...review,
        date: new Date().toISOString()
    };
    if (!product.reviews) product.reviews = [];
    product.reviews.push(newReview);
    
    // Recalculate average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / product.reviews.length;
    
    saveDB();
};

// Fix: Implement missing API functions to resolve errors in App.tsx.
export const addProductQuestion = async (productId: number, question: Omit<Question, 'id' | 'date' | 'answer'>) => {
    const product = db.products.find(p => p.id === productId);
    if (!product) throw new Error("Product not found");
    if (!product.questions) product.questions = [];
    const newQuestion: Question = {
        ...question,
        id: `q${Date.now()}`,
        date: new Date().toISOString(),
    };
    product.questions.push(newQuestion);
    saveDB();
};

export const addProductAnswer = async (productId: number, questionId: string, answer: Omit<Answer, 'date'>) => {
    const product = db.products.find(p => p.id === productId);
    if (!product || !product.questions) throw new Error("Product or questions not found");
    const question = product.questions.find(q => q.id === questionId);
    if (!question) throw new Error("Question not found");
    question.answer = {
        ...answer,
        date: new Date().toISOString()
    };
    saveDB();
};

// --- ORDER ---
export const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'subtotal' | 'tax' | 'platformFee' | 'total' | 'sellerEarnings' | 'adminEarnings' | 'shippingFee'>) => {
    const { settings } = db;
    const user = db.users.find(u => u.id === orderData.userId);
    if (!user) throw new Error('User not found');

    const subtotal = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = settings.shippingFee;
    const tax = subtotal * (settings.taxPercentage / 100);
    const platformFee = subtotal * (settings.platformFeePercentage / 100);
    const total = subtotal + shippingFee + tax;

    if (orderData.paymentMethod === 'Balance' && user.balance < total) {
        throw new Error('Insufficient balance to place order.');
    }

    const sellerEarningsMap = new Map<string, number>();
    const orderId = `o${Date.now()}`;
    
    orderData.items.forEach(item => {
        const product = db.products.find(p => p.id === item.id);
        if (!product || product.stock < item.quantity) throw new Error(`Product ${item.name} is out of stock.`);
        product.stock -= item.quantity;
        
        if (item.sellerId) {
            const itemTotal = item.price * item.quantity;
            const itemPlatformFee = itemTotal * (settings.platformFeePercentage / 100);
            const earning = itemTotal - itemPlatformFee;
            sellerEarningsMap.set(item.sellerId, (sellerEarningsMap.get(item.sellerId) || 0) + earning);
        }
    });

    const sellerEarnings: { sellerId: string, amount: number }[] = [];
    for (const [sellerId, amount] of sellerEarningsMap.entries()) {
        sellerEarnings.push({ sellerId, amount });
        const seller = db.users.find(u => u.id === sellerId);
        if (seller) {
            seller.balance += amount;
            db.transactions.push({
                id: `t${Date.now()}-${sellerId}`,
                userId: sellerId,
                date: new Date().toISOString(),
                type: 'Earning',
                description: `Sale from order #${orderId.slice(-6)}`,
                amount: amount,
                orderId: orderId,
            });
        }
    }
    
    if (orderData.paymentMethod === 'Balance') {
        user.balance -= total;
        db.transactions.push({
            id: `t${Date.now()}-${user.id}`,
            userId: user.id,
            date: new Date().toISOString(),
            type: 'Purchase',
            description: `Order #${orderId.slice(-6)}`,
            amount: -total,
            orderId: orderId,
        });
    }

    const newOrder: Order = {
        id: orderId,
        date: new Date().toISOString(),
        ...orderData,
        subtotal,
        shippingFee,
        tax,
        platformFee,
        total,
        sellerEarnings,
        adminEarnings: platformFee,
    };

    db.orders.push(newOrder);

    db.platformTransactions.push({
        id: `pt${Date.now()}`,
        date: new Date().toISOString(),
        type: 'Fee',
        description: `Platform fee for order #${newOrder.id.slice(-6)}`,
        amount: platformFee,
        orderId: newOrder.id,
    });

    db.taxLedger.push({
        id: `tax${Date.now()}`,
        orderId: newOrder.id,
        date: new Date().toISOString(),
        taxAmount: tax,
        status: 'collected',
    });

    saveDB();
};

export const updateOrder = async (updatedOrder: Order) => {
    const index = db.orders.findIndex(o => o.id === updatedOrder.id);
    if (index === -1) throw new Error("Order not found");
    db.orders[index] = updatedOrder;
    saveDB();
};

// --- PROMOTION ---
export const addPromotion = async (promo: Omit<Promotion, 'id'>) => {
    const newPromo: Promotion = { ...promo, id: `promo${Date.now()}` };
    db.promotions.push(newPromo);
    saveDB();
};
export const updatePromotion = async (updatedPromo: Promotion) => {
    const index = db.promotions.findIndex(p => p.id === updatedPromo.id);
    if (index === -1) throw new Error("Promotion not found");
    db.promotions[index] = updatedPromo;
    saveDB();
};
export const deletePromotion = async (promoId: string) => {
    db.promotions = db.promotions.filter(p => p.id !== promoId);
    saveDB();
};

// --- SETTINGS ---
export const updateSettings = async (newSettings: Settings) => {
    db.settings = newSettings;
    saveDB();
};

// --- FINANCIALS ---
export const requestPayout = async (sellerId: string, amount: number) => {
    const seller = db.users.find(u => u.id === sellerId);
    if (!seller) throw new Error("Seller not found");
    if (amount <= 0) throw new Error("Payout amount must be positive.");
    if (seller.balance < amount) throw new Error("Insufficient balance");
    
    const newRequest: PayoutRequest = {
        id: `pr${Date.now()}`,
        sellerId,
        amount,
        requestDate: new Date().toISOString(),
        status: 'pending'
    };
    db.payoutRequests.push(newRequest);
    saveDB();
};

export const addReturnRequest = async (orderId: string, userId: string, reason: string) => {
    const order = db.orders.find(o => o.id === orderId && o.userId === userId);
    if (!order) throw new Error("Order not found or does not belong to user");
    if (order.status !== 'Delivered') throw new Error("Cannot request return for an order that is not delivered.");
    if (db.returnRequests.some(r => r.orderId === orderId)) throw new Error("A return has already been requested for this order.");

    const newRequest: ReturnRequest = {
        id: `rr${Date.now()}`,
        orderId, userId, reason,
        requestDate: new Date().toISOString(),
        status: 'pending'
    };
    db.returnRequests.push(newRequest);
    saveDB();
};

export const processReturnRequest = async (requestId: string, action: 'approve' | 'reject') => {
    const request = db.returnRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') throw new Error("Request not found or already processed");

    // Fix: Map 'approve' action to 'approved' status to match the ReturnRequest type definition.
    request.status = action === 'approve' ? 'approved' : 'rejected';

    if (action === 'approve') {
        const order = db.orders.find(o => o.id === request.orderId);
        if (!order) throw new Error("Associated order not found");
        
        const customer = db.users.find(u => u.id === order.userId);
        if (customer) {
            customer.balance += order.total;
            db.transactions.push({ id: `t${Date.now()}`, userId: customer.id, date: new Date().toISOString(), type: 'Refund', description: `Refund for order #${order.id.slice(-6)}`, amount: order.total, orderId: order.id });
        }
        
        order.sellerEarnings.forEach(earning => {
            const seller = db.users.find(u => u.id === earning.sellerId);
            if (seller) {
                seller.balance -= earning.amount;
                db.transactions.push({ id: `t${Date.now()}`, userId: seller.id, date: new Date().toISOString(), type: 'Earning', description: `Return reversal for order #${order.id.slice(-6)}`, amount: -earning.amount, orderId: order.id });
            }
        });
        
        db.platformTransactions.push({ id: `pt${Date.now()}`, date: new Date().toISOString(), type: 'Fee', description: `Fee reversal for returned order #${order.id.slice(-6)}`, amount: -order.platformFee, orderId: order.id });

        order.status = 'Returned';
        order.paymentStatus = 'Refunded';
    }
    saveDB();
};

export const processPayoutRequest = async (requestId: string, action: 'approve' | 'reject') => {
    const request = db.payoutRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') throw new Error("Request not found or already processed");
    
    request.status = action === 'approve' ? 'completed' : 'rejected';
    request.processedDate = new Date().toISOString();

    if (action === 'approve') {
        const seller = db.users.find(u => u.id === request.sellerId);
        if (!seller) throw new Error("Seller not found");
        if (seller.balance < request.amount) {
            request.status = 'rejected';
            saveDB();
            throw new Error("Seller has insufficient funds. Request rejected.");
        }
        
        seller.balance -= request.amount;
        db.transactions.push({ id: `t${Date.now()}`, userId: seller.id, date: new Date().toISOString(), type: 'Payout', description: `Payout of $${request.amount.toFixed(2)}`, amount: -request.amount });
    }
    saveDB();
};

export const markTaxAsRemitted = async (taxEntryId: string) => {
    const entry = db.taxLedger.find(t => t.id === taxEntryId);
    if (!entry) throw new Error("Tax ledger entry not found");
    entry.status = 'remitted';
    saveDB();
};

export const withdrawPlatformFunds = async (amount: number) => {
    const balance = db.platformTransactions.reduce((acc, t) => acc + t.amount, 0);
    if (amount <= 0 || amount > balance) throw new Error("Invalid withdrawal amount.");
    
    db.platformTransactions.push({ id: `ptw${Date.now()}`, date: new Date().toISOString(), type: 'Withdrawal', description: `Platform funds withdrawal`, amount: -amount });
    saveDB();
};