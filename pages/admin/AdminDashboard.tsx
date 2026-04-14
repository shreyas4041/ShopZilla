
import React, { useContext, useState, useMemo } from 'react';
import { AppContext, AuthContext, ProductContext, OrderContext, PromotionContext, SettingsContext, FinancialContext } from '../../App';
import { Card, Button, Input, Spinner } from '../../components/ui';
import type { User, Product, Order, Promotion, Settings, PayoutRequest, TaxLedgerEntry, ReturnRequest, PlatformTransaction, Address, Transaction } from '../../types';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';

const StatCard: React.FC<{title: string, value: string | number, subtext?: string}> = ({title, value, subtext}) => (
    <Card className="p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-textDark dark:text-textLight">{value}</p>
        {subtext && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>}
    </Card>
);

const StatusBadge: React.FC<{status: string}> = ({ status }) => {
    const colors: {[key: string]: string} = { 
        pending: 'bg-yellow-100 text-yellow-800', 
        approved: 'bg-green-100 text-green-800', 
        rejected: 'bg-red-100 text-red-800', 
        completed: 'bg-green-100 text-green-800', 
        collected: 'bg-blue-100 text-blue-800', 
        remitted: 'bg-purple-100 text-purple-800', 
        fee: 'bg-indigo-100 text-indigo-800', 
        withdrawal: 'bg-pink-100 text-pink-800',
        customer: 'bg-sky-100 text-sky-800',
        seller: 'bg-fuchsia-100 text-fuchsia-800',
        admin: 'bg-orange-100 text-orange-800',
        purchase: 'bg-red-100 text-red-800',
        refund: 'bg-blue-100 text-blue-800',
        payout: 'bg-orange-100 text-orange-800',
        earning: 'bg-green-100 text-green-800',
        deposit: 'bg-teal-100 text-teal-800'
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const DashboardView = () => {
    const { orders } = useContext(OrderContext);
    const { users } = useContext(AuthContext);
    const { products } = useContext(ProductContext);
    const { payoutRequests, returnRequests } = useContext(FinancialContext);
    
    const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
    const pendingProductsCount = useMemo(() => products.filter(p => p.status === 'pending').length, [products]);
    const pendingSellersCount = useMemo(() => users.filter(u => u.role === 'seller' && u.sellerStatus === 'pending').length, [users]);
    const pendingPayoutsCount = useMemo(() => payoutRequests.filter(p => p.status === 'pending').length, [payoutRequests]);
    const pendingReturnsCount = useMemo(() => returnRequests.filter(r => r.status === 'pending').length, [returnRequests]);

    const recentOrders = useMemo(() => [...orders].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5), [orders]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
                <StatCard title="Total Users" value={users.length} />
                <StatCard title="Total Products" value={products.length} />
                <StatCard title="Total Orders" value={orders.length} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4 text-textDark dark:text-textLight">Pending Approvals</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm"><p>Product Submissions</p><span className="font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{pendingProductsCount}</span></div>
                        <div className="flex justify-between items-center text-sm"><p>Seller Applications</p><span className="font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{pendingSellersCount}</span></div>
                        <div className="flex justify-between items-center text-sm"><p>Payout Requests</p><span className="font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{pendingPayoutsCount}</span></div>
                        <div className="flex justify-between items-center text-sm"><p>Return Requests</p><span className="font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{pendingReturnsCount}</span></div>
                    </div>
                </Card>

                <Card className="p-6 lg:col-span-2">
                    <h3 className="font-semibold text-lg mb-4 text-textDark dark:text-textLight">Recent Orders</h3>
                    <div className="overflow-x-auto"><table className="w-full text-sm">
                        <thead className="text-left text-xs text-gray-500 uppercase"><tr className="border-b dark:border-gray-700"><th className="pb-2">Order ID</th><th className="pb-2">Date</th><th className="pb-2">Customer</th><th className="pb-2">Total</th><th className="pb-2">Status</th></tr></thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id} className="border-b dark:border-gray-700">
                                    <td className="py-2 font-mono text-xs">#{order.id.slice(-6)}</td>
                                    <td className="py-2">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="py-2">{users.find(u => u.id === order.userId)?.name || 'N/A'}</td>
                                    <td className="py-2 font-semibold">${order.total.toFixed(2)}</td>
                                    <td className="py-2"><StatusBadge status={order.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                </Card>
            </div>
        </div>
    );
}

const ProductManagement = () => {
    const { products, updateProduct, deleteProduct } = useContext(ProductContext);
    const { users } = useContext(AuthContext);
    const { addToast } = useToast();
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
    
    const filteredProducts = useMemo(() => products.filter(p => p.status === filter), [products, filter]);
    
    const getSellerName = (sellerId?: string) => {
        if (!sellerId) return 'N/A';
        return users.find(u => u.id === sellerId)?.name || sellerId;
    };

    const handleProductUpdate = (product: Product, status: 'approved' | 'rejected') => {
        updateProduct({ ...product, status });
        addToast(`Product ${status}.`, 'success');
    };
    
    const handleProductDelete = (id: number) => {
        if (window.confirm('Are you sure you want to permanently delete this product?')) {
            deleteProduct(id);
            addToast('Product deleted.', 'success');
        }
    };
    
    return (
        <Card>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-textDark dark:text-textLight">Product Management</h2>
                <div className="flex space-x-1 sm:space-x-4 mt-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {['pending', 'approved', 'rejected'].map(status => (
                        <button key={status} onClick={() => setFilter(status as any)} className={`capitalize pb-2 px-2 border-b-2 ${filter === status ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-accent'}`}>{status}</button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto"><table className="w-full text-sm">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-primary"><tr><th className="px-6 py-3 text-left">Product</th><th className="px-6 py-3 text-left">Seller</th><th className="px-6 py-3 text-left">Price</th><th className="px-6 py-3 text-center">Actions</th></tr></thead>
                <tbody>
                    {filteredProducts.map(p => (
                        <tr key={p.id} className="border-b dark:border-gray-700">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-md bg-gray-100 dark:bg-primary" />
                                    <div>
                                        <p className="font-semibold text-textDark dark:text-textLight">{p.name}</p>
                                        <p className="text-xs text-gray-500">{p.category}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">{getSellerName(p.sellerId)}</td>
                            <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                            <td className="px-6 py-4 text-center space-x-2">
                                {filter === 'pending' && <>
                                    <Button onClick={() => handleProductUpdate(p, 'approved')} className="text-xs h-auto py-1 px-2">Approve</Button>
                                    <Button variant="outline" onClick={() => handleProductUpdate(p, 'rejected')} className="text-xs h-auto py-1 px-2">Reject</Button>
                                </>}
                                {filter !== 'pending' && <Button variant="outline" onClick={() => handleProductDelete(p.id)} className="text-xs h-auto py-1 px-2">Delete</Button>}
                            </td>
                        </tr>
                    ))}
                     {filteredProducts.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-500">No products in this category.</td></tr>}
                </tbody>
            </table></div>
        </Card>
    );
};

const SellerManagement = () => {
    const { users, updateUser, deleteUser } = useContext(AuthContext);
    const { addToast } = useToast();
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

    const sellers = useMemo(() => users.filter(u => u.role === 'seller' && u.sellerStatus === filter), [users, filter]);

    const handleSellerStatusUpdate = (user: User, status: 'approved' | 'rejected') => {
        updateUser({ ...user, sellerStatus: status });
        addToast(`Seller account for ${user.name} has been ${status}.`, 'success');
    };

    const handleDelete = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user? This is irreversible.')) {
            deleteUser(userId);
            addToast('User deleted.', 'success');
        }
    }

    return (
        <Card>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-textDark dark:text-textLight">Seller Account Management</h2>
                <div className="flex space-x-1 sm:space-x-4 mt-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                    {['pending', 'approved', 'rejected'].map(status => (
                        <button key={status} onClick={() => setFilter(status as any)} className={`capitalize pb-2 px-2 border-b-2 ${filter === status ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-accent'}`}>{status}</button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto"><table className="w-full text-sm">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-primary"><tr><th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Email</th><th className="px-6 py-3 text-left">Date Joined</th><th className="px-6 py-3 text-center">Actions</th></tr></thead>
                <tbody>
                    {sellers.map(u => (
                        <tr key={u.id} className="border-b dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-textDark dark:text-textLight">{u.name}</td>
                            <td className="px-6 py-4">{u.email}</td>
                            <td className="px-6 py-4">{new Date(parseInt(u.id.split('-')[1])).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-center space-x-2">
                                {filter === 'pending' && <>
                                    <Button onClick={() => handleSellerStatusUpdate(u, 'approved')} className="text-xs h-auto py-1 px-2">Approve</Button>
                                    <Button variant="outline" onClick={() => handleSellerStatusUpdate(u, 'rejected')} className="text-xs h-auto py-1 px-2">Reject</Button>
                                </>}
                                {filter !== 'pending' && <Button variant="outline" onClick={() => handleDelete(u.id)} className="text-xs h-auto py-1 px-2">Delete</Button>}
                            </td>
                        </tr>
                    ))}
                     {sellers.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-500">No sellers in this category.</td></tr>}
                </tbody>
            </table></div>
        </Card>
    );
};

const UserManagement = () => {
    const { users, deleteUser } = useContext(AuthContext);
    const { addToast } = useToast();

    const handleDelete = (user: User) => {
        if (user.role === 'admin') {
            addToast("Cannot delete an admin account.", 'error');
            return;
        }
        if (window.confirm(`Are you sure you want to delete the user "${user.name}"? This action is irreversible.`)) {
            deleteUser(user.id);
            addToast('User deleted successfully.', 'success');
        }
    };

    return (
        <Card>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-textDark dark:text-textLight">User Management</h2>
                <p className="text-sm text-gray-500 mt-1">A list of all users in the system including their roles and details.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-xs uppercase bg-gray-50 dark:bg-primary">
                        <tr>
                            <th className="px-6 py-3 text-left">Name / ID</th>
                            <th className="px-6 py-3 text-left">Contact</th>
                            <th className="px-6 py-3 text-left">Role</th>
                            <th className="px-6 py-3 text-left">Balance</th>
                            <th className="px-6 py-3 text-left">Address</th>
                            <th className="px-6 py-3 text-center">Wishlist</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => {
                            const address = u.addresses?.[0];
                            const formattedAddress = address 
                                ? `${address.street}, ${address.city}, ${address.state} ${address.zip}` 
                                : 'N/A';

                            return (
                                <tr key={u.id} className="border-b dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium text-textDark dark:text-textLight">
                                        {u.name}
                                        <p className="text-xs text-gray-500 font-mono">{u.id}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.email}
                                        <p className="text-xs text-gray-500">{u.phone || 'No phone'}</p>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={u.role} /> {u.role === 'seller' && <span className="text-xs text-gray-500 ml-1">({u.sellerStatus})</span>}</td>
                                    <td className="px-6 py-4">${u.balance.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-xs max-w-xs truncate" title={formattedAddress}>{formattedAddress}</td>
                                    <td className="px-6 py-4 text-center">{u.wishlist.length}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Button variant="outline" onClick={() => handleDelete(u)} className="text-xs h-auto py-1 px-2" disabled={u.role === 'admin'}>Delete</Button>
                                    </td>
                                </tr>
                            );
                        })}
                         {users.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-gray-500">No users found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};


const FinancialManagement = () => {
    const { payoutRequests, taxLedger, returnRequests, platformTransactions, transactions, processPayoutRequest, processReturnRequest, markTaxAsRemitted, withdrawPlatformFunds } = useContext(FinancialContext);
    const { users } = useContext(AuthContext);
    const { orders } = useContext(OrderContext);
    const { addToast } = useToast();
    
    const { totalFees, totalWithdrawals, platformBalance } = useMemo(() => {
        const fees = platformTransactions.filter(t => t.type === 'Fee').reduce((acc, t) => acc + t.amount, 0);
        const withdrawals = platformTransactions.filter(t => t.type === 'Withdrawal').reduce((acc, t) => acc + t.amount, 0);
        const balance = fees + withdrawals;
        return { totalFees: fees, totalWithdrawals: Math.abs(withdrawals), platformBalance: balance };
    }, [platformTransactions]);
    
    const unifiedTransactions = useMemo(() => {
        const all = [
            ...platformTransactions.map(t => ({
                id: t.id,
                date: new Date(t.date),
                type: t.type,
                entity: 'Platform',
                description: t.description,
                orderId: t.orderId,
                amount: t.amount,
                role: 'platform'
            })),
            ...transactions.map(t => {
                const user = users.find(u => u.id === t.userId);
                return {
                    id: t.id,
                    date: new Date(t.date),
                    type: t.type,
                    entity: user?.name || 'Unknown User',
                    description: t.description,
                    orderId: t.orderId,
                    amount: t.amount,
                    role: user?.role
                }
            })
        ];
        return all.sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [platformTransactions, transactions, users]);

    const handlePayout = (id: string, action: 'approve' | 'reject') => { processPayoutRequest(id, action); addToast(`Payout request ${action}d.`, 'success'); };
    const handleReturn = (id: string, action: 'approve' | 'reject') => { processReturnRequest(id, action); addToast(`Return request ${action}d.`, 'success'); };
    const handleRemitTax = (id: string) => { markTaxAsRemitted(id); addToast('Tax marked as remitted.', 'success'); };

    const handleWithdraw = async () => {
        const amountStr = prompt('Enter amount to withdraw:', platformBalance.toFixed(2));
        if (amountStr === null) return;
        const amount = parseFloat(amountStr);

        if (!isNaN(amount) && amount > 0 && amount <= platformBalance) {
            try {
                await withdrawPlatformFunds(amount);
                addToast('Withdrawal processed.', 'success');
            } catch (error: any) {
                addToast(error.message, 'error');
            }
        } else {
            addToast('Invalid amount.', 'error');
        }
    };

    const pendingPayouts = useMemo(() => payoutRequests.filter(p => p.status === 'pending'), [payoutRequests]);
    const pendingReturns = useMemo(() => returnRequests.filter(r => r.status === 'pending'), [returnRequests]);
    const unremittedTaxes = useMemo(() => taxLedger.filter(t => t.status === 'collected'), [taxLedger]);
    const getUserName = (id: string) => users.find(u => u.id === id)?.name || id;
    const getOrderTotal = (orderId: string) => orders.find(o => o.id === orderId)?.total || 0;
    
    return (
        <div className="space-y-8">
            <Card className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-500">Platform Balance</p>
                        <p className="text-3xl font-bold text-textDark dark:text-textLight">${platformBalance.toFixed(2)}</p>
                        <div className="flex gap-6 mt-2 text-xs text-gray-500">
                           <span>Total Fees Collected: <span className="font-semibold text-green-500">${totalFees.toFixed(2)}</span></span>
                           <span>Total Withdrawn: <span className="font-semibold text-red-500">${totalWithdrawals.toFixed(2)}</span></span>
                        </div>
                    </div>
                    <Button onClick={handleWithdraw}>Withdraw Funds</Button>
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-semibold p-6 text-textDark dark:text-textLight">Pending Payouts ({pendingPayouts.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-primary">
                            <tr>
                                <th className="px-6 py-3 text-left">Seller</th>
                                <th className="px-6 py-3 text-left">Seller Balance</th>
                                <th className="px-6 py-3 text-left">Amount Requested</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingPayouts.map(req => {
                                const seller = users.find(u => u.id === req.sellerId);
                                return (
                                <tr key={req.id} className="border-b dark:border-gray-700">
                                    <td className="px-6 py-4">{seller?.name || req.sellerId}</td>
                                    <td className="px-6 py-4">${(seller?.balance || 0).toFixed(2)}</td>
                                    <td className="px-6 py-4 font-semibold">${req.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">{new Date(req.requestDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <Button onClick={() => handlePayout(req.id, 'approve')} className="text-xs h-auto py-1 px-2">Approve</Button>
                                        <Button variant="outline" onClick={() => handlePayout(req.id, 'reject')} className="text-xs h-auto py-1 px-2">Reject</Button>
                                    </td>
                                </tr>
                            )})}
                            {pendingPayouts.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-500">No pending payouts.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-semibold p-6 text-textDark dark:text-textLight">Pending Returns ({pendingReturns.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-primary">
                            <tr>
                                <th className="px-6 py-3 text-left">Order ID</th>
                                <th className="px-6 py-3 text-left">Order Value</th>
                                <th className="px-6 py-3 text-left">User</th>
                                <th className="px-6 py-3 text-left">Reason</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingReturns.map(req => (
                                <tr key={req.id} className="border-b dark:border-gray-700">
                                    <td className="px-6 py-4 font-mono text-xs">#{req.orderId.slice(-6)}</td>
                                    <td className="px-6 py-4 font-semibold">${getOrderTotal(req.orderId).toFixed(2)}</td>
                                    <td className="px-6 py-4">{getUserName(req.userId)}</td>
                                    <td className="px-6 py-4 text-xs max-w-sm truncate" title={req.reason}>{req.reason}</td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <Button onClick={() => handleReturn(req.id, 'approve')} className="text-xs h-auto py-1 px-2">Approve</Button>
                                        <Button variant="outline" onClick={() => handleReturn(req.id, 'reject')} className="text-xs h-auto py-1 px-2">Reject</Button>
                                    </td>
                                </tr>
                            ))}
                             {pendingReturns.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-500">No pending returns.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card>
                 <h2 className="text-2xl font-semibold p-6 text-textDark dark:text-textLight">Unremitted Taxes ({unremittedTaxes.length})</h2>
                 <div className="overflow-x-auto">
                     <table className="w-full text-sm">
                         <thead className="text-xs uppercase bg-gray-50 dark:bg-primary">
                             <tr>
                                 <th className="px-6 py-3 text-left">Order ID</th>
                                 <th className="px-6 py-3 text-left">Date</th>
                                 <th className="px-6 py-3 text-left">Tax Amount</th>
                                 <th className="px-6 py-3 text-center">Actions</th>
                             </tr>
                         </thead>
                         <tbody>
                            {unremittedTaxes.map(tax => (
                                 <tr key={tax.id} className="border-b dark:border-gray-700">
                                     <td className="px-6 py-4 font-mono text-xs">#{tax.orderId.slice(-6)}</td>
                                     <td className="px-6 py-4">{new Date(tax.date).toLocaleDateString()}</td>
                                     <td className="px-6 py-4 font-semibold">${tax.taxAmount.toFixed(2)}</td>
                                     <td className="px-6 py-4 text-center">
                                         <Button onClick={() => handleRemitTax(tax.id)} className="text-xs h-auto py-1 px-2">Mark as Remitted</Button>
                                     </td>
                                 </tr>
                            ))}
                            {unremittedTaxes.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-500">No taxes to remit.</td></tr>}
                         </tbody>
                     </table>
                 </div>
            </Card>
            
            <Card>
                <h2 className="text-2xl font-semibold p-6 text-textDark dark:text-textLight">Unified Transaction Log</h2>
                <p className="px-6 pb-4 text-sm text-gray-500 -mt-4">A complete log of all financial events on the platform.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-primary">
                            <tr>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Entity</th>
                                <th className="px-6 py-3 text-left">Type</th>
                                <th className="px-6 py-3 text-left">Description</th>
                                <th className="px-6 py-3 text-left">Order ID</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unifiedTransactions.map(t => (
                                <tr key={t.id} className="border-b dark:border-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">{t.date.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-textDark dark:text-textLight">{t.entity}</p>
                                        {t.role && t.role !== 'platform' && <p className="text-xs text-gray-500 capitalize">{t.role}</p>}
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={t.type} /></td>
                                    <td className="px-6 py-4 text-xs">{t.description}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{t.orderId ? `#${t.orderId.slice(-6)}` : 'N/A'}</td>
                                    <td className={`px-6 py-4 text-right font-semibold ${t.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>{t.amount >= 0 ? `+$${t.amount.toFixed(2)}` : `-$${Math.abs(t.amount).toFixed(2)}`}</td>
                                </tr>
                            ))}
                            {unifiedTransactions.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-500">No transactions found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

const PromotionManagement = () => {
    // This is a placeholder. A full implementation would require a form in a modal.
    const { promotions } = useContext(PromotionContext);
    return (
        <Card>
            <div className="p-6 flex justify-between items-center">
                 <h2 className="text-2xl font-semibold text-textDark dark:text-textLight">Promotions</h2>
                 <Button>Add Promotion</Button>
            </div>
            <div className="overflow-x-auto"><table className="w-full text-sm">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-primary"><tr><th className="px-6 py-3 text-left">Title</th><th className="px-6 py-3 text-left">Subtitle</th><th className="px-6 py-3">Link</th><th className="px-6 py-3">Actions</th></tr></thead>
                <tbody>
                    {promotions.map(p => (
                        <tr key={p.id} className="border-b dark:border-gray-700">
                            <td className="px-6 py-4">{p.title}</td><td className="px-6 py-4">{p.subtitle}</td><td className="px-6 py-4">{p.link}</td>
                            <td className="px-6 py-4 space-x-2"><Button variant="ghost" className="text-xs h-auto py-1 px-2">Edit</Button><Button variant="ghost" className="text-xs h-auto py-1 px-2 text-accent">Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table></div>
        </Card>
    )
}

const SettingsManagement = () => {
    const { settings, updateSettings } = useContext(SettingsContext);
    const { addToast } = useToast();
    const [formState, setFormState] = useState<Settings>({ taxPercentage: 0, shippingFee: 0, platformFeePercentage: 0, platformPayoutInfo: { bankName: '', accountHolder: '', accountNumber: '' } });
    
    React.useEffect(() => { if (settings) setFormState(s => ({...s, ...settings})); }, [settings]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormState(s => ({ ...s, [e.target.name]: parseFloat(e.target.value) || 0 }));
    
    const handlePayoutInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(s => ({ ...s, platformPayoutInfo: { ...s.platformPayoutInfo!, [e.target.name]: e.target.value } }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateSettings(formState);
        addToast('Settings updated!', 'success');
    }

    if (!settings) return <Spinner />;

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-textDark dark:text-textLight">Platform Settings</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2 dark:border-gray-700">Financials</h3>
                    <Input label="Tax Percentage (%)" name="taxPercentage" type="number" step="0.1" value={formState.taxPercentage} onChange={handleChange} />
                    <Input label="Default Shipping Fee ($)" name="shippingFee" type="number" step="0.01" value={formState.shippingFee} onChange={handleChange} />
                    <Input label="Platform Fee Percentage (%)" name="platformFeePercentage" type="number" step="0.1" value={formState.platformFeePercentage} onChange={handleChange} />
                </div>
                 <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2 dark:border-gray-700">Platform Payout Details</h3>
                    <p className="text-xs text-gray-500 !mt-2">Bank details for withdrawing platform funds.</p>
                    <Input label="Bank Name" name="bankName" value={formState.platformPayoutInfo?.bankName || ''} onChange={handlePayoutInfoChange} />
                    <Input label="Account Holder Name" name="accountHolder" value={formState.platformPayoutInfo?.accountHolder || ''} onChange={handlePayoutInfoChange} />
                    <Input label="Account Number" name="accountNumber" value={formState.platformPayoutInfo?.accountNumber || ''} onChange={handlePayoutInfoChange} />
                </div>
                <div className="pt-2 md:col-span-2">
                    <Button type="submit">Save Settings</Button>
                </div>
            </form>
        </Card>
    );
}

const AdminDashboard: React.FC = () => {
  const { isLoading } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  if (isLoading) { return <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>; }

  const renderContent = () => {
      switch(activeTab) {
          case 'dashboard': return <DashboardView />;
          case 'products': return <ProductManagement />;
          case 'sellers': return <SellerManagement />;
          case 'users': return <UserManagement />;
          case 'financials': return <FinancialManagement />;
          case 'promotions': return <PromotionManagement />;
          case 'settings': return <SettingsManagement />;
          default: return null;
      }
  }

  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'products', label: 'Products' },
    { key: 'sellers', label: 'Seller Accounts' },
    { key: 'users', label: 'User Management' },
    { key: 'financials', label: 'Financials' },
    { key: 'promotions', label: 'Promotions' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-textDark dark:text-textLight">Admin Dashboard</h1>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`${
                activeTab === tab.key
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
       
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
