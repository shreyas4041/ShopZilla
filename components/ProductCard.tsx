import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { Button } from './ui';
import { CartContext, AuthContext, WishlistContext } from '../App';
import { useToast } from './Toast';
import { HeartIcon } from './Icons';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useContext(WishlistContext);
  const { addToast } = useToast();

  const inWishlist = isProductInWishlist(product.id);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    addToast(`${product.name} added to cart!`, 'success');
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      addToast(`${product.name} removed from wishlist`, 'info');
    } else {
      addToWishlist(product.id);
      addToast(`${product.name} added to wishlist!`, 'success');
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div
        className={`bg-white dark:bg-secondary rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 transition-all duration-300 relative flex flex-col h-full ${
          isOutOfStock
            ? 'opacity-60 grayscale'
            : 'hover:shadow-xl hover:border-accent/50'
        }`}
      >
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          {user && (
            <button
              onClick={handleWishlistClick}
              className="absolute top-3 right-3 bg-white/80 dark:bg-secondary/80 p-2 rounded-full text-gray-500 hover:text-accent transition-colors z-10"
              aria-label={
                inWishlist ? 'Remove from wishlist' : 'Add to wishlist'
              }
            >
              <HeartIcon
                className={`w-5 h-5 transition-all ${
                  inWishlist ? 'text-accent fill-accent' : ''
                }`}
              />
            </button>
          )}
          {product.originalPrice && (
            <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
              SALE
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            {product.category}
          </p>
          <h3
            className={`mt-1 text-lg font-semibold text-textDark dark:text-textLight ${
              !isOutOfStock ? 'group-hover:text-accent' : ''
            } transition-colors flex-grow`}
          >
            {product.name}
          </h3>
           <div className="mt-2 flex items-baseline">
             <p className="text-xl font-bold text-accent">
               ${product.price.toFixed(2)}
             </p>
             {product.originalPrice && (
               <p className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                 ${product.originalPrice.toFixed(2)}
               </p>
             )}
           </div>
           {product.rating && (
            <div className="mt-2">
                <StarRating rating={product.rating} />
            </div>
           )}
          <div className="h-5 mt-2">
            <p className={`text-sm font-semibold ${isOutOfStock ? 'text-red-500' : 'text-teal-600 dark:text-teal-400'}`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} left)`}
            </p>
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full mt-3"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;