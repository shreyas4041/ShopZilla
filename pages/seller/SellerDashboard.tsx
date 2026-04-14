

import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Input, Spinner } from '../../components/ui';
import { AppContext, ProductContext, AuthContext, OrderContext, FinancialContext, SettingsContext } from '../../App';
import type { Product, Order, Transaction, PayoutRequest, ReturnRequest, ProductCategory } from '../../types';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';

const DollarSignIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ShoppingBagIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const StarIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;

const StatusBadge: React.FC<{status: string}> = ({ status }) => {
    const colors: {[key: string]: string} = { pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${colors[status.toLowerCase()]}`}>{status}</span>;
}

const ProductForm: React.FC<{product?: Product; onSave: (product: any) => void; onCancel: () => void;}> = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ 
        name: product?.name || '', 
        description: product?.description || '', 
        price: product?.price || 0, 
        originalPrice: product?.originalPrice || 0, 
        stock: product?.stock || 0, 
        category: product?.category || 'Electronics',
        categories: {
            main: product?.categories.main || 'Electronics',
            sub: product?.categories.sub || '',
            type: product?.categories.type || '',
            gender: product?.categories.gender || 'Unisex',
            ageGroup: product?.categories.ageGroup || 'Adult',
        },
        brand: product?.brand || '', 
        images: product?.images?.join(', ') || product?.imageUrl || ''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            categories: { ...prev.categories, [name]: value }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        const price = parseFloat(formData.price as any); 
        const originalPrice = formData.originalPrice ? parseFloat(formData.originalPrice as any) : undefined;
        const images = formData.images.split(',').map(s => s.trim()).filter(Boolean);
        onSave({ 
            ...formData, 
            category: formData.categories.main, // For backward compatibility
            price, 
            originalPrice: originalPrice === price ? undefined : originalPrice,
            imageUrl: images[0] || 'https://picsum.photos/seed/default/400/400',
            images: images
        }); 
    }
    const textAreaClasses = "block w-full px-4 py-3 border rounded-md shadow-sm sm:text-sm bg-white dark:bg-primary border-gray-300 dark:border-gray-600 text-textDark dark:text-textLight focus:ring-accent focus:border-accent";
    const labelClasses = "block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1";
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Product Name" name="name" value={formData.name} onChange={handleChange} required/>
                <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} required/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className={labelClasses}>Gender</label>
                    <select name="gender" value={formData.categories.gender} onChange={handleCategoryChange} className={textAreaClasses}>
                        <option>Unisex</option><option>Men</option><option>Women</option>
                    </select>
                </div>
                 <div>
                    <label className={labelClasses}>Age Group</label>
                    <select name="ageGroup" value={formData.categories.ageGroup} onChange={handleCategoryChange} className={textAreaClasses}>
                        <option>Adult</option><option>Kids</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className={labelClasses}>Main Category</label>
                    <select name="main" value={formData.categories.main} onChange={handleCategoryChange} className={textAreaClasses}>
                        <option>Electronics</option><option>Fashion</option><option>Books</option><option>Groceries</option><option>Home & Kitchen</option>
                    </select>
                </div>
                <Input label="Sub-Category (e.g., Shoes)" name="sub" value={formData.categories.sub} onChange={handleCategoryChange} required />
                <Input label="Type (e.g., Casual)" name="type" value={formData.categories.type} onChange={handleCategoryChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="Price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required/>
                <Input label="Original Price (Optional)" name="originalPrice" type="number" step="0.01" value={formData.originalPrice} onChange={handleChange} />
                <Input label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required/>
            </div>
            <div>
                <label className={labelClasses}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className={textAreaClasses}></textarea>
            </div>
             <div>
                <label className={labelClasses}>Product Images</label>
                <textarea name="images" value={formData.images} onChange={handleChange} rows={3} placeholder="Enter image URLs, separated by commas" className={textAreaClasses}></textarea>
                <p className="text-xs text-gray-500 mt-1">The first URL will be the main cover image.</p>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{product ? "Save Changes" : "Add Product"}</Button>
            </div>
        </form>
    )
}

const OrderManagement: React.FC = () => {
    const { user, users } = useContext(AuthContext);
    const { orders, updateOrder } = useContext(OrderContext);
    const { addToast } = useToast();
    const sellerOrders = useMemo(() => orders.filter(order => order.items.some(item => item.sellerId === user?.id)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [orders, user]);
    const handleStatusChange = (order: Order, newStatus: Order['status']) => { updateOrder({...order, status: newStatus}); addToast(`Order #${order.id.slice(-6)} status updated`, 'success'); }
    const handleTrackingUpdate = (order: Order, trackingNumber: string) => { updateOrder({...order, trackingNumber}); addToast(`Tracking for order #${order.id.slice(-6)} updated`, 'success'); }
    const getEarningForOrder = (order: Order) => order.sellerEarnings.find(e => e.sellerId === user?.id)?.amount || 0;
    const getCustomerForOrder = (order: Order) => users.find(u => u.id === order.userId);
    return (
        <Card><h2 className="text-2xl font-semibold text-textDark dark:text-textLight p-6 border-b border-gray-200 dark:border-gray-700">Your Orders</h2><div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-600 dark:text-gray-400"><thead className="text-xs uppercase bg-gray-50 dark:bg-primary"><tr><th className="px-6 py-3">Order</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Items</th><th className="px-6 py-3">Your Earnings</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Tracking</th></tr></thead><tbody>
        {sellerOrders.map(order => {
            const customer = getCustomerForOrder(order);
            return (
            <tr key={order.id} className="border-b dark:border-gray-700"><td className="px-6 py-4 font-medium">#{order.id.slice(-6)} <br/> <span className="font-normal text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</span></td><td className="px-6 py-4 text-xs"><p className="font-semibold text-textDark dark:text-textLight">{customer?.name}</p><p>{order.shippingAddress.street}, {order.shippingAddress.city}</p></td><td className="px-6 py-4 text-xs">{order.items.filter(i => i.sellerId === user?.id).map(i => `${i.quantity}x ${i.name}`).join(', ')}</td><td className="px-6 py-4 font-bold text-green-500">${getEarningForOrder(order).toFixed(2)}</td><td className="px-6 py-4"><select value={order.status} onChange={e => handleStatusChange(order, e.target.value as Order['status'])} className="bg-transparent border rounded p-1"><option>Pending</option><option>Processing</option><option>Shipped</option><option>Out for Delivery</option><option>Delivered</option></select></td><td className="px-6 py-4"><Input type="text" placeholder="Add tracking..." defaultValue={order.trackingNumber} onBlur={e => handleTrackingUpdate(order, e.target.value)} className="py-1" label=""/></td></tr>
        )})}
        </tbody></table></div></Card>
    )
}

const AnalyticsDashboard: React.FC<{ onPayoutClick: () => void }> = ({ onPayoutClick }) => {
    const { user } = useContext(AuthContext);
    const { orders } = useContext(OrderContext);
    const { products } = useContext(ProductContext);
    const { payoutRequests } = useContext(FinancialContext);
    
    const hasPendingPayout = useMemo(() => payoutRequests.some(pr => pr.sellerId === user?.id && pr.status === 'pending'), [payoutRequests, user]);

    const { totalEarnings, unitsSold, bestSellers, monthlyEarnings, averageRating } = useMemo(() => {
        if (!user) return { totalEarnings: 0, unitsSold: 0, bestSellers: [], monthlyEarnings: Array(12).fill(0), averageRating: 0 };
        const earnings = Array(12).fill(0);
        let totalEarnings = 0;
        let unitsSold = 0;
        const productSales: Record<number, number> = {};
        const sellerProducts = products.filter(p => p.sellerId === user.id);
        
        orders.forEach(order => {
            const earningForOrder = order.sellerEarnings.find(e => e.sellerId === user.id);
            if (earningForOrder) {
                totalEarnings += earningForOrder.amount;
                const month = new Date(order.date).getMonth();
                earnings[month] += earningForOrder.amount;
            }
            order.items.forEach(item => { if(item.sellerId === user.id){ unitsSold += item.quantity; productSales[item.id] = (productSales[item.id] || 0) + item.quantity; } })
        });

        const bestSellers = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([productId, quantity]) => ({ name: products.find(p => p.id === Number(productId))?.name || 'Unknown', quantity }));
        const totalRating = sellerProducts.reduce((sum, p) => sum + (p.rating || 0), 0);
        const ratedProductsCount = sellerProducts.filter(p => p.rating).length;
        const averageRating = ratedProductsCount > 0 ? totalRating / ratedProductsCount : 0;
        return { totalEarnings, unitsSold, bestSellers, monthlyEarnings: earnings, averageRating };
    }, [user, orders, products]);
    
    const maxEarning = Math.max(...monthlyEarnings, 1);
    const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (<Card className="p-6 flex items-center gap-4"><div className="bg-accent/10 p-3 rounded-full">{icon}</div><div><p className="text-sm text-gray-500 dark:text-gray-400">{title}</p><p className="text-2xl font-bold text-textDark dark:text-textLight">{value}</p></div></Card>);
    const SalesChart = () => (<Card className="p-6"><h3 className="text-xl font-semibold mb-4 text-textDark dark:text-textLight">Monthly Earnings</h3><div className="h-64 flex items-end justify-between gap-2">{monthlyEarnings.map((earning, i) => (<div key={i} className="flex-1 flex flex-col items-center gap-2 group"><div className="w-full bg-gray-200 dark:bg-secondary rounded-full h-full flex items-end"><div className="bg-accent rounded-full w-full transition-all duration-300 group-hover:bg-accent-hover" style={{ height: `${(earning / maxEarning) * 100}%` }}></div></div><span className="text-xs text-gray-500">{new Date(0, i).toLocaleString('default', { month: 'short' })}</span></div>))}</div></Card>);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Lifetime Earnings" value={`$${totalEarnings.toFixed(2)}`} icon={<DollarSignIcon className="h-6 w-6 text-accent"/>} />
                <StatCard title="Total Units Sold" value={unitsSold} icon={<ShoppingBagIcon className="h-6 w-6 text-accent"/>} />
                <StatCard title="Avg. Product Rating" value={`${averageRating.toFixed(1)} ★`} icon={<StarIcon className="h-6 w-6 text-accent"/>} />
                <Card className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Account Balance</p>
                    <p className="text-2xl font-bold text-textDark dark:text-textLight">${(user?.balance || 0).toFixed(2)}</p>
                    <Button onClick={onPayoutClick} variant="outline" className="w-full mt-3 text-xs py-1.5 h-auto" disabled={hasPendingPayout} title={hasPendingPayout ? "You have a pending payout request" : ""}>
                        {hasPendingPayout ? 'Payout Pending' : 'Request Payout'}
                    </Button>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2"><SalesChart /></div>
                <Card><h3 className="text-xl font-semibold text-textDark dark:text-textLight p-6 border-b border-gray-200 dark:border-gray-700">Best Sellers</h3><ul className="divide-y divide-gray-200 dark:divide-gray-700">{bestSellers.map(p => (<li key={p.name} className="px-6 py-4 flex justify-between items-center"><span className="font-medium text-textDark dark:text-textLight">{p.name}</span><span className="text-gray-500 dark:text-gray-400">{p.quantity} units sold</span></li>))}</ul></Card>
            </div>
        </div>
    );
};

const FinancesDashboard: React.FC<{ onEarningDetailClick: (order: Order) => void }> = ({ onEarningDetailClick }) => {
    const { user } = useContext(AuthContext);
    const { transactions, payoutRequests } = useContext(FinancialContext);

    const userTransactions = useMemo(() => transactions.filter(t => t.userId === user?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [transactions, user]);
    const userPayoutRequests = useMemo(() => payoutRequests.filter(pr => pr.sellerId === user?.id).sort((a,b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()), [payoutRequests, user]);
    const isPayoutInfoComplete = user?.payoutInfo?.bankName && user?.payoutInfo?.accountHolder && user?.payoutInfo?.accountNumber;
    
    const { lifetimeEarnings, totalWithdrawn } = useMemo(() => {
        if (!user) return { lifetimeEarnings: 0, totalWithdrawn: 0 };
        const earnings = userTransactions.filter(t => t.type === 'Earning').reduce((sum, t) => sum + t.amount, 0);
        const withdrawn = userTransactions.filter(t => t.type === 'Payout').reduce((sum, t) => sum + Math.abs(t.amount), 0);
        return { lifetimeEarnings: earnings, totalWithdrawn: withdrawn };
    }, [user, userTransactions]);

    const handleExport = () => {
        const headers = ["Date", "Type", "Description", "Amount"];
        const rows = userTransactions.map(t => [ new Date(t.date).toLocaleString(), t.type, `"${t.description.replace(/"/g, '""')}"`, t.amount.toFixed(2) ].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `transaction_history_${user?.id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const StatCard: React.FC<{title: string, value: string}> = ({title, value}) => (
        <Card className="p-4"><p className="text-xs text-gray-500 dark:text-gray-400">{title}</p><p className="text-2xl font-bold text-textDark dark:text-textLight">{value}</p></Card>
    );

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Lifetime Earnings" value={`$${lifetimeEarnings.toFixed(2)}`} />
                <StatCard title="Total Withdrawn" value={`$${totalWithdrawn.toFixed(2)}`} />
                <StatCard title="Available Balance" value={`$${(user?.balance || 0).toFixed(2)}`} />
            </div>

            {!isPayoutInfoComplete && (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4 rounded" role="alert">
                    <p className="font-bold">Action Required</p>
                    <p>Please <Link to="/profile" className="font-semibold underline">update your payout settings</Link> to be able to withdraw your funds.</p>
                </div>
            )}
            <Card>
                <h2 className="text-2xl font-semibold text-textDark dark:text-textLight p-6 border-b border-gray-200 dark:border-gray-700">Payout Requests</h2>
                <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-600 dark:text-gray-400"><thead className="text-xs uppercase bg-gray-50 dark:bg-primary"><tr><th className="px-6 py-3">Requested</th><th className="px-6 py-3">Processed</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th></tr></thead><tbody>
                {userPayoutRequests.map(pr => (
                    <tr key={pr.id} className="border-b dark:border-gray-700">
                        <td className="px-6 py-4">{new Date(pr.requestDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{pr.processedDate ? new Date(pr.processedDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 py-4 font-semibold">${pr.amount.toFixed(2)}</td>
                        <td className="px-6 py-4"><StatusBadge status={pr.status}/></td>
                    </tr>
                ))}
                {userPayoutRequests.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-500">No payout requests found.</td></tr>}
                </tbody></table></div>
            </Card>

            <Card>
                <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-semibold text-textDark dark:text-textLight">Transaction History</h2>
                    <Button variant="outline" onClick={handleExport}>Export History</Button>
                </div>
                <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-600 dark:text-gray-400"><thead className="text-xs uppercase bg-gray-50 dark:bg-primary"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Type</th><th className="px-6 py-3">Description</th><th className="px-6 py-3">Details</th><th className="px-6 py-3 text-right">Amount</th></tr></thead><tbody>
                {userTransactions.map(t => {
                    const order = t.orderId ? useContext(OrderContext).orders.find(o => o.id === t.orderId) : null;
                    return (
                        <tr key={t.id} className="border-b dark:border-gray-700">
                            <td className="px-6 py-4">{new Date(t.date).toLocaleString()}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${t.type.includes('Earning') ? 'bg-green-100 text-green-800' : (t.type.includes('Refund') || t.type.includes('Purchase') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800')}`}>{t.type}</span></td>
                            <td className="px-6 py-4">{t.description}</td>
                            <td className="px-6 py-4">{t.type === 'Earning' && order && <Button variant="ghost" className="text-xs h-auto py-1 px-2" onClick={() => onEarningDetailClick(order)}>Details</Button>}</td>
                            <td className={`px-6 py-4 text-right font-semibold ${t.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>{t.amount >= 0 ? `+$${t.amount.toFixed(2)}` : `-$${Math.abs(t.amount).toFixed(2)}`}</td>
                        </tr>
                    )
                })}
                </tbody></table></div>
            </Card>
        </div>
    );
};

const ReturnsDashboard: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { orders } = useContext(OrderContext);
    const { returnRequests } = useContext(FinancialContext);

    const sellerReturnRequests = useMemo(() => {
        return returnRequests.filter(req => {
            const order = orders.find(o => o.id === req.orderId);
            return order && order.items.some(item => item.sellerId === user?.id);
        }).sort((a,b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
    }, [returnRequests, orders, user]);

    return (
        <Card>
            <h2 className="text-2xl font-semibold text-textDark dark:text-textLight p-6 border-b border-gray-200 dark:border-gray-700">Product Returns</h2>
            <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="text-xs uppercase bg-gray-50 dark:bg-primary"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Reason</th><th className="px-6 py-3">Status</th></tr></thead><tbody>
                {sellerReturnRequests.map(req => (
                    <tr key={req.id} className="border-b dark:border-gray-700">
                        <td className="px-6 py-4">{new Date(req.requestDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-medium">#{req.orderId.slice(-6)}</td>
                        <td className="px-6 py-4 text-xs max-w-xs truncate">{req.reason}</td>
                        <td className="px-6 py-4"><StatusBadge status={req.status}/></td>
                    </tr>
                ))}
                 {sellerReturnRequests.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-500">No return requests for your products.</td></tr>}
            </tbody></table></div>
        </Card>
    );
}

const SellerDashboard: React.FC = () => {
  const { user, requestPayout } = useContext(AuthContext);
  const { products, addProduct, updateProduct, deleteProduct } = useContext(ProductContext);
  const { isLoading } = useContext(AppContext);
  const { addToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('analytics');
  const [isPayoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const sellerProducts = useMemo(() => products.filter((p: Product) => p.sellerId === user?.id), [products, user]);
  const isPayoutInfoComplete = useMemo(() => user?.payoutInfo?.bankName && user?.payoutInfo?.accountHolder && user?.payoutInfo?.accountNumber, [user]);

  const handleAddNew = () => { setEditingProduct(undefined); setIsFormOpen(true); }
  const handleEdit = (product: Product) => { setEditingProduct(product); setIsFormOpen(true); }
  const handleDelete = (productId: number) => { if(window.confirm('Are you sure?')) { deleteProduct(productId); addToast('Product deleted', 'success'); } }
  const handleSave = (formData: any) => { if(editingProduct) { updateProduct({ ...editingProduct, ...formData }); addToast('Product updated', 'success'); } else { addProduct({ ...formData, sellerId: user?.id }); addToast('Product submitted for approval', 'success'); } setIsFormOpen(false); setEditingProduct(undefined); }
  
  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (payoutAmount <= 0) { addToast('Please enter a valid amount.', 'error'); return; }
    if (payoutAmount > (user.balance || 0)) { addToast('Withdrawal amount cannot exceed your balance.', 'error'); return; }
    try {
        await requestPayout(user.id, payoutAmount);
        addToast(`$${payoutAmount.toFixed(2)} payout successfully requested!`, 'success');
        setPayoutModalOpen(false);
        setPayoutAmount(0);
    } catch (err: any) {
        addToast(err.message, 'error');
    }
  }

  const TabButton = ({ tabName, label }: { tabName: string; label: string }) => ( <button onClick={() => setActiveTab(tabName)} className={`${activeTab === tabName ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>{label}</button> );
  if (isLoading || !user) { return <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>; }

  const renderContent = () => {
    switch(activeTab) {
        case 'analytics': return <AnalyticsDashboard onPayoutClick={() => setPayoutModalOpen(true)} />;
        case 'products': return (
            <>
                <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'} size="lg">
                  <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
                </Modal>
                <Card><h2 className="text-2xl font-semibold text-textDark dark:text-textLight p-6 border-b border-gray-200 dark:border-gray-700">Your Products</h2><div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-600 dark:text-gray-400"><thead className="text-xs uppercase bg-gray-50 dark:bg-primary"><tr><th scope="col" className="px-6 py-3">Product</th><th scope="col" className="px-6 py-3">Price</th><th scope="col" className="px-6 py-3">Stock</th><th scope="col" className="px-6 py-3">Status</th><th scope="col" className="px-6 py-3">Actions</th></tr></thead><tbody>
                {sellerProducts.map((p: Product) => (<tr key={p.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-primary"><th scope="row" className="px-6 py-4 font-medium text-textDark dark:text-textLight whitespace-nowrap">{p.name}</th><td className="px-6 py-4">${p.price.toFixed(2)}</td><td className="px-6 py-4">{p.stock}{p.stock < 10 && <span className="ml-2 text-xs font-bold text-red-500">(Low Stock)</span>}</td><td className="px-6 py-4"><StatusBadge status={p.status}/></td><td className="px-6 py-4 space-x-2"><Link to={`/products/${p.id}`} target="_blank" rel="noopener noreferrer"><Button variant="ghost" className="px-3 py-1">View</Button></Link><Button variant="ghost" className="px-3 py-1" onClick={() => handleEdit(p)}>Edit</Button><Button variant="ghost" className="px-3 py-1 text-accent hover:bg-accent/10" onClick={() => handleDelete(p.id)}>Delete</Button></td></tr>))}
                </tbody></table></div></Card>
            </>
        );
        case 'orders': return <OrderManagement />;
        case 'finances': return <FinancesDashboard onEarningDetailClick={setViewingOrder} />;
        case 'returns': return <ReturnsDashboard />;
        default: return <AnalyticsDashboard onPayoutClick={() => setPayoutModalOpen(true)} />;
    }
  }

  const EarningDetailsModalContent: React.FC = () => {
    if (!viewingOrder) return null;
    const sellerItems = viewingOrder.items.filter(i => i.sellerId === user.id);
    const grossSaleValue = sellerItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const netEarning = viewingOrder.sellerEarnings.find(e => e.sellerId === user.id)?.amount || 0;
    const feeDeducted = grossSaleValue - netEarning;
    return (
        <div className="space-y-4 text-sm">
            <p>Financial breakdown for your items in Order #{viewingOrder.id.slice(-6)}.</p>
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-2 space-y-2">
                <div className="flex justify-between"><span>Gross Sale Value:</span> <span className="font-medium">${grossSaleValue.toFixed(2)}</span></div>
                <div className="flex justify-between text-red-500"><span>Platform Fees & Charges:</span> <span className="font-medium">-${feeDeducted.toFixed(2)}</span></div>
            </div>
            <div className="flex justify-between font-bold text-base text-green-500"><span>Net Earning:</span> <span>${netEarning.toFixed(2)}</span></div>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-4xl font-bold text-textDark dark:text-textLight">Seller Dashboard</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">Manage your products, orders, and sales.</p>
            </div>
            {activeTab === 'products' && !isFormOpen && 
                <Button 
                    onClick={handleAddNew} 
                    disabled={user.sellerStatus !== 'approved'}
                    title={user.sellerStatus !== 'approved' ? 'Your account must be approved to add products.' : 'Add a new product'}
                >
                    Add New Product
                </Button>
            }
        </div>

        {user.sellerStatus === 'pending' && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4 rounded mb-8" role="alert">
                <p className="font-bold">Account Pending Approval</p>
                <p>Your seller account is currently under review. You will have full access to all features once your account is approved by an administrator.</p>
            </div>
        )}
        {user.sellerStatus === 'rejected' && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-300 p-4 rounded mb-8" role="alert">
                <p className="font-bold">Account Rejected</p>
                <p>Unfortunately, your seller account application was not approved. Please contact support if you believe this is an error.</p>
            </div>
        )}

        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                <TabButton tabName="analytics" label="Analytics" />
                <TabButton tabName="products" label="Products" />
                <TabButton tabName="orders" label="Orders" />
                <TabButton tabName="finances" label="Finances"/>
                <TabButton tabName="returns" label="Returns"/>
            </nav>
        </div>
        <div className={user.sellerStatus !== 'approved' ? 'opacity-50 pointer-events-none' : ''}>
            {renderContent()}
        </div>

        <Modal isOpen={isPayoutModalOpen} onClose={() => setPayoutModalOpen(false)} title="Request a Payout">
            <form onSubmit={handlePayoutRequest} className="space-y-4">
                <p className="text-sm text-gray-500">Your current available balance is <span className="font-bold text-textDark dark:text-textLight">${(user.balance || 0).toFixed(2)}</span>.</p>
                <div className="relative">
                    <Input label="Withdrawal Amount" type="number" step="0.01" max={user.balance || 0} value={payoutAmount} onChange={e => setPayoutAmount(parseFloat(e.target.value) || 0)} required />
                    <Button type="button" variant="ghost" className="absolute right-1 bottom-1 text-xs h-auto py-1 px-2" onClick={() => setPayoutAmount(user.balance || 0)}>
                        Max
                    </Button>
                </div>
                <div className="flex justify-end pt-2"><Button type="submit" disabled={!isPayoutInfoComplete} title={!isPayoutInfoComplete ? 'Please complete your payout information in your profile first.' : ''}>Submit Request</Button></div>
            </form>
        </Modal>

        <Modal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} title="Earning Breakdown">
          <EarningDetailsModalContent />
        </Modal>
    </div>
  );
};

export default SellerDashboard;