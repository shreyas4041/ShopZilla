import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext, AuthContext, OrderContext, ProductContext, FinancialContext } from '../App';
import { Card, Input, Button, Spinner } from '../components/ui';
import type { Order, CartItem, User, Address, PayoutInfo, ReturnRequest } from '../types';
import ProductCard from '../components/ProductCard';
import OrderStatusTracker from '../components/OrderStatusTracker';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';

const ReturnRequestForm: React.FC<{ order: Order; onSubmit: () => void; }> = ({ order, onSubmit }) => {
    const { user } = useContext(AuthContext);
    const { addReturnRequest } = useContext(FinancialContext);
    const { addToast } = useToast();
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || reason.trim() === '') {
            addToast('Please provide a reason for the return.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await addReturnRequest(order.id, user.id, reason);
            addToast('Return request submitted successfully!', 'success');
            onSubmit();
        } catch (error: any) {
            addToast(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-500">You are requesting a return for Order #{order.id.slice(-6)}.</p>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Reason for Return</label>
                <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={4} className="block w-full px-4 py-3 border rounded-md shadow-sm sm:text-sm bg-white dark:bg-primary border-gray-300 dark:border-gray-600 text-textDark dark:text-textLight focus:ring-accent focus:border-accent" placeholder="e.g., Item was damaged, wrong item received, etc." required/>
            </div>
            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Request'}</Button>
            </div>
        </form>
    );
};

const OrderItem: React.FC<{order: Order}> = ({ order }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isReturnModalOpen, setReturnModalOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 py-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-textDark dark:text-textLight">Order #{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Placed on: {new Date(order.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-textDark dark:text-textLight">Total: ${order.total.toFixed(2)}</p>
                    <div className="flex gap-2 justify-end mt-1">
                        <Button variant="ghost" className="text-xs h-auto py-1 px-2" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
                            {isDetailsOpen ? 'Hide Details' : 'View Details'}
                        </Button>
                         {order.status === 'Delivered' && (
                            <Button variant="outline" className="text-xs h-auto py-1 px-2" onClick={() => setReturnModalOpen(true)}>Request Return</Button>
                        )}
                    </div>
                </div>
            </div>
            {isDetailsOpen && (
                <div className="bg-gray-50 dark:bg-primary p-4 rounded-md mt-4 text-sm space-y-2">
                    <h4 className="font-semibold text-textDark dark:text-textLight">Financial Breakdown</h4>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Subtotal:</span> <span>${order.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Shipping:</span> <span>${order.shippingFee.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Tax:</span> <span>${order.tax.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-textDark dark:text-textLight border-t border-gray-200 dark:border-gray-700 mt-2 pt-2"><span>Total:</span> <span>${order.total.toFixed(2)}</span></div>
                </div>
            )}
            <div className="mt-4">
                <OrderStatusTracker status={order.status} />
            </div>
            <div className="mt-4">
                <p className="font-semibold text-sm mb-1 text-textDark dark:text-textLight">Items:</p>
                {order.items.map(item => (
                    <div key={item.id} className="text-sm text-gray-600 dark:text-gray-300 ml-4">- {item.quantity} x {item.name}</div>
                ))}
            </div>
            {(order.status === 'Shipped' || order.status === 'Out for Delivery' || order.status === 'Delivered') && order.trackingNumber && (
                <div className="text-sm mt-3">
                    <span className="font-medium text-gray-600 dark:text-gray-300">Tracking: </span>
                    <a href={`https://www.google.com/search?q=${order.trackingNumber}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">{order.trackingNumber}</a>
                </div>
            )}
             <Modal isOpen={isReturnModalOpen} onClose={() => setReturnModalOpen(false)} title="Request a Return">
                <ReturnRequestForm order={order} onSubmit={() => setReturnModalOpen(false)} />
            </Modal>
        </div>
    )
}

const ProfilePage: React.FC = () => {
  const { user, logout, updateUser, changePassword } = useContext(AuthContext);
  const { orders } = useContext(OrderContext);
  const { products } = useContext(ProductContext);
  const { returnRequests, transactions } = useContext(FinancialContext);
  const { isLoading } = useContext(AppContext);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('details');
  const [details, setDetails] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [address, setAddress] = useState<Omit<Address, 'id' | 'country'>>(user?.addresses[0] || { street: '', city: '', state: '', zip: '' });
  const [payoutInfo, setPayoutInfo] = useState<PayoutInfo>(user?.payoutInfo || { bankName: '', accountHolder: '', accountNumber: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') { navigate('/admin/dashboard'); return; }
    if (!user) { navigate('/auth'); }
  }, [user, navigate]);
  
  useEffect(() => {
    if (user) {
        setDetails({ name: user.name, phone: user.phone });
        setAddress(user.addresses[0] || { street: '', city: '', state: '', zip: '' });
        setPayoutInfo(user.payoutInfo || { bankName: '', accountHolder: '', accountNumber: '' });
    }
}, [user]);

  useEffect(() => { if (location.hash === '#wishlist') { setActiveTab('wishlist'); } }, [location.hash]);

  if (isLoading || !user) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>;
  }
  
  const handleSave = async (updateFn: () => Promise<any>, successMessage: string) => {
    setIsSaving(true);
    try {
        await updateFn();
        addToast(successMessage, 'success');
    } catch (err: any) {
        addToast(err.message || 'An error occurred.', 'error');
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleDetailsSave = (e: React.FormEvent) => { e.preventDefault(); if(user) handleSave(() => updateUser({ ...user, name: details.name, phone: details.phone }), 'Account details updated!'); };
  const handleAddressSave = (e: React.FormEvent) => { e.preventDefault(); if(user) { const newAddress: Address = { ...address, id: user.addresses[0]?.id || 'addr1', country: 'USA' }; handleSave(() => updateUser({ ...user, addresses: [newAddress] }), 'Address updated!'); } };
  const handlePayoutInfoSave = (e: React.FormEvent) => { e.preventDefault(); if(user) handleSave(() => updateUser({ ...user, payoutInfo }), 'Payout information updated!'); };
  const handlePasswordChange = (e: React.FormEvent) => { e.preventDefault(); if (passwordData.newPassword !== passwordData.confirmNewPassword) { addToast('New passwords do not match.', 'error'); return; } handleSave(() => changePassword(user.id, passwordData.currentPassword, passwordData.newPassword), 'Password changed successfully!'); setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); };

  const userOrders = orders.filter(o => o.userId === user.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const userWishlistProducts = products.filter(p => user?.wishlist?.includes(p.id));
  const userReturnRequests = returnRequests.filter(r => r.userId === user.id).sort((a,b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
  const userTransactions = transactions.filter(t => t.userId === user.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  const TabButton = ({ tab, label }: { tab: string; label: string }) => ( <button onClick={() => setActiveTab(tab)} className={`w-full text-left px-4 py-2 rounded-md transition-colors text-sm font-medium ${ activeTab === tab ? 'bg-accent/10 text-accent' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary'}`}> {label} </button> );
  const StatusBadge: React.FC<{status: string}> = ({ status }) => { const colors: {[key: string]: string} = { pending: 'bg-yellow-100 text-yellow-800', completed: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', approved: 'bg-green-100 text-green-800', purchase: 'bg-red-100 text-red-800', refund: 'bg-blue-100 text-blue-800', deposit: 'bg-green-100 text-green-800' }; return <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{status}</span>; }
  const isPayoutInfoComplete = user.payoutInfo?.bankName && user.payoutInfo?.accountHolder && user.payoutInfo?.accountNumber;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-textDark dark:text-textLight">Your Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 flex flex-col gap-8">
          <Card className="p-4"><nav className="flex flex-col space-y-1"><TabButton tab="details" label="Account Details" /><TabButton tab="address" label="Shipping Address" /><TabButton tab="orders" label="Order History" /><TabButton tab="transactions" label="Transaction History" /><TabButton tab="returns" label="My Returns" />{user.role === 'seller' ? <TabButton tab="payout" label="Payout Settings" /> : <TabButton tab="refund" label="Refund Method" />}<TabButton tab="security" label="Security" /><TabButton tab="wishlist" label="My Wishlist" /></nav></Card>
          <Card className="p-4"><Button onClick={logout} variant="outline" className="w-full">Logout</Button></Card>
        </aside>

        <main className="md:col-span-3">
            {activeTab === 'details' && <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">Account Details</h2><form className="space-y-4" onSubmit={handleDetailsSave}><Input label="Full Name" id="name" name="name" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} /><Input label="Email Address" id="email" name="email" type="email" defaultValue={user.email} disabled /><Input label="Phone Number" id="phone" name="phone" type="tel" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} />{user.balance !== undefined && <Input label="Account Balance" id="balance" name="balance" value={`$${(user.balance).toFixed(2)}`} disabled />}<div className="pt-2"><Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Update Profile'}</Button></div></form></Card>}
            {activeTab === 'address' && <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">Shipping Address</h2><form className="space-y-4" onSubmit={handleAddressSave}><Input label="Street" id="street" name="street" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} /><Input label="City" id="city" name="city" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} /><Input label="State" id="state" name="state" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} /><Input label="Zip Code" id="zip" name="zip" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} /><div className="pt-2"><Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Update Address'}</Button></div></form></Card>}
            {activeTab === 'orders' && <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">Order History</h2>{userOrders.length > 0 ? (<div>{userOrders.map(order => <OrderItem key={order.id} order={order} />)}</div>) : ( <div className="text-center text-gray-500 py-8"><p>You have no past orders.</p></div> )}</Card>}
            {activeTab === 'transactions' && 
                <Card className="p-0">
                    <h2 className="text-2xl font-semibold p-6 border-b dark:border-gray-700">Transaction History</h2>
                    {userTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-xs uppercase bg-gray-50 dark:bg-primary">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Date</th>
                                        <th className="px-6 py-3 text-left">Type</th>
                                        <th className="px-6 py-3 text-left">Description</th>
                                        <th className="px-6 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userTransactions.map(t => (
                                        <tr key={t.id} className="border-b dark:border-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(t.date).toLocaleString()}</td>
                                            <td className="px-6 py-4"><StatusBadge status={t.type} /></td>
                                            <td className="px-6 py-4">{t.description}</td>
                                            <td className={`px-6 py-4 text-right font-semibold ${t.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {t.amount >= 0 ? `+$${t.amount.toFixed(2)}` : `-$${Math.abs(t.amount).toFixed(2)}`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8 px-6">
                            <p>You have no transaction history.</p>
                        </div>
                    )}
                </Card>
            }
            {activeTab === 'returns' && <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">My Returns</h2>{userReturnRequests.length > 0 ? (<div className="space-y-4">{userReturnRequests.map(req => <div key={req.id} className="p-4 rounded-md border border-gray-200 dark:border-gray-700 flex justify-between items-center"><p className="text-sm">Return for Order #{req.orderId.slice(-6)} - <span className="text-gray-500">{new Date(req.requestDate).toLocaleDateString()}</span></p><StatusBadge status={req.status} /></div>)}</div>) : ( <div className="text-center text-gray-500 py-8"><p>You have not made any return requests.</p></div> )}</Card>}
            
            {(activeTab === 'payout' && user.role === 'seller') && <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">Payout Settings</h2>{!isPayoutInfoComplete && (<div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4 mb-6 rounded" role="alert"><p className="font-bold">Action Required</p><p>Please complete your payout information to receive payments for your sales.</p></div>)}<p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This is where your earnings will be sent. Please ensure this information is correct.</p><form className="space-y-4" onSubmit={handlePayoutInfoSave}><Input label="Bank Name" id="bankName" name="bankName" value={payoutInfo.bankName} onChange={e => setPayoutInfo({...payoutInfo, bankName: e.target.value})} /><Input label="Account Holder Name" id="accountHolder" name="accountHolder" value={payoutInfo.accountHolder} onChange={e => setPayoutInfo({...payoutInfo, accountHolder: e.target.value})} /><Input label="Account Number" id="accountNumber" name="accountNumber" value={payoutInfo.accountNumber} onChange={e => setPayoutInfo({...payoutInfo, accountNumber: e.target.value})} /><div className="pt-2"><Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Update Payout Info'}</Button></div></form></Card>}

            {(activeTab === 'refund' && user.role === 'customer') && <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">Refund Method</h2>{!isPayoutInfoComplete && (<div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4 mb-6 rounded" role="alert"><p className="font-bold">Action Required</p><p>Please add your bank details to receive funds for any approved refunds.</p></div>)}<p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This is where funds from approved returns will be sent. Please ensure this information is correct.</p><form className="space-y-4" onSubmit={handlePayoutInfoSave}><Input label="Bank Name" id="bankName" name="bankName" value={payoutInfo.bankName} onChange={e => setPayoutInfo({...payoutInfo, bankName: e.target.value})} /><Input label="Account Holder Name" id="accountHolder" name="accountHolder" value={payoutInfo.accountHolder} onChange={e => setPayoutInfo({...payoutInfo, accountHolder: e.target.value})} /><Input label="Account Number" id="accountNumber" name="accountNumber" value={payoutInfo.accountNumber} onChange={e => setPayoutInfo({...payoutInfo, accountNumber: e.target.value})} /><div className="pt-2"><Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Update Refund Method'}</Button></div></form></Card>}

            {activeTab === 'security' && <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">Change Password</h2><form className="space-y-4" onSubmit={handlePasswordChange}><Input label="Current Password" id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} required/><Input label="New Password" id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required/><Input label="Confirm New Password" id="confirmNewPassword" name="confirmNewPassword" type="password" value={passwordData.confirmNewPassword} onChange={e => setPasswordData({...passwordData, confirmNewPassword: e.target.value})} required/><div className="pt-2"><Button type="submit" disabled={isSaving}>{isSaving ? 'Changing...' : 'Change Password'}</Button></div></form></Card>}
            {activeTab === 'wishlist' && <Card className="p-6"><h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>{userWishlistProducts.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">{userWishlistProducts.map(product => <ProductCard key={product.id} product={product} />)}</div>) : (<div className="text-center text-gray-500 py-8"><p>Your wishlist is empty.</p><p className="text-sm mt-2">Click the heart icon on a product to save it here.</p></div>)}</Card>}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;