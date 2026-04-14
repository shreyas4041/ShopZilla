
import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext, AuthContext, ProductContext } from '../App';
import NotFoundPage from './NotFoundPage';
import ProductCard from '../components/ProductCard';
import { Card, Spinner } from '../components/ui';

const VerifiedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;

const SellerProfilePage: React.FC = () => {
    const { sellerId } = useParams<{ sellerId: string }>();
    const { users } = useContext(AuthContext);
    const { products } = useContext(ProductContext);
    const { isLoading } = useContext(AppContext);

    const seller = useMemo(() => users.find(u => u.id === sellerId && u.role === 'seller'), [users, sellerId]);
    const sellerProducts = useMemo(() => products.filter(p => p.sellerId === sellerId && p.status === 'approved'), [products, sellerId]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>;
    }

    if (!seller || seller.sellerStatus !== 'approved') {
        return <NotFoundPage />;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="p-8 mb-12 bg-gray-50 dark:bg-secondary/50">
                <div className="flex items-center">
                    <h1 className="text-4xl font-bold text-textDark dark:text-textLight">{seller.name}</h1>
                    {seller.sellerStatus === 'approved' && <div className="flex items-center ml-4"><VerifiedIcon /> <span className="ml-1 text-blue-500 font-semibold">Verified Seller</span></div>}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Discover all products from {seller.name} on ShopZilla.</p>
            </Card>

            <h2 className="text-3xl font-bold mb-8 text-textDark dark:text-textLight">Products from this Seller</h2>
            {sellerProducts.length > 0 ? (
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {sellerProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <Card className="text-center py-20">
                    <p className="text-xl text-gray-500">This seller has no products listed yet.</p>
                </Card>
            )}
        </div>
    );
};

export default SellerProfilePage;