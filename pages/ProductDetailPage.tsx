

import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext, ProductContext, CartContext, AuthContext, WishlistContext, OrderContext } from '../App';
import { Button, Spinner, Card } from '../components/ui';
import NotFoundPage from './NotFoundPage';
import QuantitySelector from '../components/QuantitySelector';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';
import { HeartIcon, StarIcon, ShareIcon, ShippingIcon, SecurePaymentIcon, EasyReturnsIcon, UserIcon } from '../components/Icons';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
// Fix: Imported the 'Product' type to resolve a TypeScript error.
import type { Product, Review, Question, Answer } from '../types';

const ReviewForm: React.FC<{ productId: number; onReviewSubmit: () => void }> = ({ productId, onReviewSubmit }) => {
    const { user } = useContext(AuthContext);
    const { addProductReview } = useContext(ProductContext);
    const { addToast } = useToast();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || rating === 0 || comment.trim() === '') {
            addToast('Please provide a rating and a comment.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await addProductReview(productId, {
                userId: user.id,
                userName: user.name,
                rating,
                comment,
            });
            addToast('Review submitted successfully!', 'success');
            onReviewSubmit();
        } catch (error) {
            addToast('Failed to submit review.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <p className="font-medium mb-2 text-textDark dark:text-textLight">Your Rating</p>
                <div className="flex space-x-1">
                    {[...Array(5)].map((_, index) => (
                        <StarIcon
                            key={index}
                            className={`w-8 h-8 cursor-pointer transition-colors ${
                                (hoverRating || rating) > index ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            onClick={() => setRating(index + 1)}
                            onMouseEnter={() => setHoverRating(index + 1)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    ))}
                </div>
            </div>
            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your Review</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="block w-full px-4 py-3 border rounded-md shadow-sm sm:text-sm bg-white dark:bg-primary border-gray-300 dark:border-gray-600 text-textDark dark:text-textLight focus:ring-accent focus:border-accent"
                    placeholder="Tell us what you think about this product..."
                    required
                />
            </div>
            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
            </div>
        </form>
    );
};

const QandASection: React.FC<{ product: Product }> = ({ product }) => {
    const { user } = useContext(AuthContext);
    const { addProductQuestion, addProductAnswer } = useContext(ProductContext);
    const { addToast } = useToast();
    const [questionText, setQuestionText] = useState('');
    const [answerText, setAnswerText] = useState('');
    const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || questionText.trim() === '') {
            addToast('Please write a question.', 'error');
            return;
        }
        try {
            await addProductQuestion(product.id, { userId: user.id, userName: user.name, text: questionText });
            addToast('Question submitted!', 'success');
            setQuestionText('');
        } catch (error) {
            addToast('Failed to submit question.', 'error');
        }
    };
    
    const handleAnswerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !answeringQuestionId || answerText.trim() === '') {
             addToast('Please write an answer.', 'error');
            return;
        }
        try {
            await addProductAnswer(product.id, answeringQuestionId, { sellerId: user.id, text: answerText });
            addToast('Answer posted!', 'success');
            setAnswerText('');
            setAnsweringQuestionId(null);
        } catch (error) {
            addToast('Failed to post answer.', 'error');
        }
    };

    return (
        <div id="qanda">
            <h2 className="text-3xl font-bold text-center mb-10 text-textDark dark:text-textLight">Questions & Answers</h2>
            <Card className="p-8">
                {user && (
                    <form onSubmit={handleQuestionSubmit} className="mb-8 p-4 bg-gray-50 dark:bg-primary rounded-lg">
                        <label htmlFor="question" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Have a question? Ask the seller.</label>
                        <div className="flex gap-2">
                            <input id="question" value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="e.g., Is this product compatible with..." className="flex-grow block w-full px-4 py-3 border rounded-md shadow-sm sm:text-sm bg-white dark:bg-secondary border-gray-300 dark:border-gray-600 text-textDark dark:text-textLight focus:ring-accent focus:border-accent" required />
                            <Button type="submit">Ask Question</Button>
                        </div>
                    </form>
                )}
                 <div className="space-y-6 divide-y divide-gray-200 dark:divide-gray-700">
                    {(product.questions && product.questions.length > 0) ? product.questions.map(q => (
                        <div key={q.id} className="pt-6 first:pt-0">
                            <p className="font-semibold text-textDark dark:text-textLight">Q: {q.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Asked by {q.userName} on {new Date(q.date).toLocaleDateString()}</p>
                            
                            {q.answer ? (
                                <div className="mt-2 pl-6 border-l-2 border-accent">
                                    <p className="font-semibold text-textDark dark:text-textLight">A: {q.answer.text}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Answered by the seller on {new Date(q.answer.date).toLocaleDateString()}</p>
                                </div>
                            ) : (
                                user?.id === product.sellerId ? (
                                    answeringQuestionId === q.id ? (
                                        <form onSubmit={handleAnswerSubmit} className="mt-2 pl-6">
                                            <textarea value={answerText} onChange={e => setAnswerText(e.target.value)} rows={2} className="block w-full px-4 py-2 border rounded-md shadow-sm sm:text-sm bg-white dark:bg-secondary border-gray-300 dark:border-gray-600 focus:ring-accent focus:border-accent" required />
                                            <div className="flex gap-2 mt-2">
                                                <Button type="submit" className="text-xs h-auto py-1 px-2">Post Answer</Button>
                                                <Button type="button" variant="ghost" className="text-xs h-auto py-1 px-2" onClick={() => setAnsweringQuestionId(null)}>Cancel</Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <Button variant="outline" className="text-xs h-auto py-1 px-2 mt-2" onClick={() => { setAnsweringQuestionId(q.id); setAnswerText(''); }}>Answer</Button>
                                    )
                                ) : (
                                    <p className="text-sm text-gray-500 mt-2 pl-6">No answer yet.</p>
                                )
                            )}
                        </div>
                    )) : (
                         <div className="text-center py-8 text-gray-500">
                            <p>No questions yet. Be the first to ask!</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};


const TrustBadge: React.FC<{ icon: React.ReactNode, title: string, subtitle: string }> = ({ icon, title, subtitle }) => (
    <div className="bg-gray-100 dark:bg-primary p-4 rounded-lg flex items-center gap-4 border border-gray-200 dark:border-gray-700">
        <div className="text-accent">{icon}</div>
        <div>
            <p className="font-semibold text-sm text-textDark dark:text-textLight">{title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
    </div>
);


const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products: allProducts } = useContext(ProductContext);
  const { cart, addToCart, updateQuantity } = useContext(CartContext);
  const { user, users } = useContext(AuthContext);
  const { orders } = useContext(OrderContext);
  const { addToWishlist, removeFromWishlist, isProductInWishlist } = useContext(WishlistContext);
  const { addToast } = useToast();
  const { isLoading } = useContext(AppContext);
  
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  
  const product = useMemo(() => allProducts.find(p => p.id === Number(id)), [allProducts, id]);
  
  const [mainImage, setMainImage] = useState(product?.imageUrl);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setMainImage(product.imageUrl);
    }
  }, [id, product]);

  const seller = useMemo(() => users.find(u => u.id === product?.sellerId), [users, product]);
  
  const hasPurchased = useMemo(() => {
      if (!user || !product) return false;
      return orders.some(order => 
          order.userId === user.id &&
          order.status === 'Delivered' &&
          order.items.some(item => item.id === product.id)
      );
  }, [user, orders, product]);
  
  const hasReviewed = useMemo(() => {
    if (!user || !product?.reviews) return false;
    return product.reviews.some(review => review.userId === user.id);
  }, [user, product]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>;
  }

  if (!product || product.status !== 'approved') {
    return <NotFoundPage />;
  }
  
  const itemInCart = cart.find(item => item.id === product.id);
  const inWishlist = isProductInWishlist(product.id);
  const isOutOfStock = product.stock === 0;
  const relatedProducts = allProducts.filter(p => p.status === 'approved' && p.category === product.category && p.id !== product.id).slice(0, 4);
  const allImages = [product.imageUrl, ...(product.images || [])].filter((v, i, a) => a.indexOf(v) === i);


  const handleAddToCart = () => {
    addToCart(product, quantity);
    addToast(`${quantity} x ${product.name} added to cart!`, 'success');
  }
  
  const handleUpdateQuantity = () => {
      if(itemInCart){
          const newQuantity = itemInCart.quantity + quantity;
          updateQuantity(product.id, newQuantity);
          addToast(`${quantity} more ${product.name} added to cart!`, 'success');
      }
  }

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      addToast(`${product.name} removed from wishlist`, 'info');
    } else {
      addToWishlist(product.id);
      addToast(`${product.name} added to wishlist!`, 'success');
    }
  };

  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: product.name,
      text: `Check out this product on ShopZilla: ${product.name}`,
      url: window.location.href,
    };

    // Use the modern Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // The native share UI provides feedback, so a toast might be redundant.
      } catch (error) {
        // This can happen if the user cancels the share. No need to show an error.
        console.log('Web Share API failed:', error);
      }
    } else {
      // Fallback to copying the link to the clipboard
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link to="/" className="hover:text-accent">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-accent">Products</Link>
        <span className="mx-2">/</span>
        <Link to={`/products?category=${encodeURIComponent(product.categories.main)}`} className="hover:text-accent">{product.categories.main}</Link>
        {product.categories.gender && (
            <>
                <span className="mx-2">/</span>
                <Link to={`/products?gender=${encodeURIComponent(product.categories.gender)}`} className="hover:text-accent">{product.categories.gender}</Link>
            </>
        )}
        <span className="mx-2">/</span>
        <Link to={`/products?category=${encodeURIComponent(product.categories.main)}&subCategory=${encodeURIComponent(product.categories.sub)}`} className="hover:text-accent">{product.categories.sub}</Link>
        {product.categories.type && (
            <>
                <span className="mx-2">/</span>
                <span className="text-textDark dark:text-textLight font-medium">{product.categories.type}</span>
            </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white dark:bg-secondary rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
          </div>
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${mainImage === img ? 'border-accent' : 'border-transparent hover:border-accent/50'}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <span className="inline-block bg-gray-100 dark:bg-secondary text-gray-600 dark:text-gray-300 text-xs font-semibold px-3 py-1 rounded-full w-fit">{product.categories.sub}</span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-2 text-textDark dark:text-textLight">{product.name}</h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Brand: <span className="font-semibold text-textDark dark:text-textLight">{product.brand}</span></p>
          {seller && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Sold by: <Link to={`/sellers/${seller.id}`} className="font-semibold text-accent hover:underline">{seller.name}</Link></p>}

          <a href="#reviews" className="mt-4 flex items-center gap-2">
              {product.rating ? <StarRating rating={product.rating} /> : <span className="text-sm text-gray-500">No reviews yet</span>}
              {product.reviews && product.reviews.length > 0 && <span className="text-sm text-gray-500 hover:underline">({product.reviews.length} reviews)</span>}
          </a>

          <div className="flex items-baseline gap-4 my-6">
            <span className="text-4xl font-bold text-accent">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-2xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm font-bold bg-red-500 text-white px-2 py-1 rounded-md">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
            )}
          </div>
          
          <p className={`flex items-center gap-2 font-semibold ${!isOutOfStock ? 'text-teal-500' : 'text-red-500'}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${!isOutOfStock ? 'bg-teal-500' : 'bg-red-500'}`}></span>
              {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
          </p>

          <div className="flex items-center gap-4 mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <span className="font-semibold text-textDark dark:text-textLight">Quantity:</span>
              {!isOutOfStock && <QuantitySelector quantity={quantity} onIncrease={() => setQuantity(q => q + 1)} onDecrease={() => setQuantity(q => (q > 1 ? q - 1 : 1))} />}
          </div>
          
          <div className="flex items-center gap-2 mt-6">
              <Button onClick={itemInCart ? handleUpdateQuantity : handleAddToCart} disabled={isOutOfStock} className="flex-grow !py-3 !text-base">
                  {isOutOfStock ? 'Out of Stock' : (itemInCart ? 'Add More to Cart' : 'Add to Cart')}
              </Button>
              {user && <button onClick={handleWishlistClick} className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-secondary transition-colors" aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
                  <HeartIcon className={`w-6 h-6 transition-all ${inWishlist ? 'text-accent fill-accent' : 'text-gray-500'}`} />
              </button>}
              <button onClick={handleShare} className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-secondary transition-colors" aria-label="Share product">
                  <ShareIcon className="w-6 h-6 text-gray-500" />
              </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <TrustBadge icon={<ShippingIcon className="w-6 h-6"/>} title="Free Shipping" subtitle="On orders $25+" />
            <TrustBadge icon={<SecurePaymentIcon className="w-6 h-6"/>} title="Secure Payment" subtitle="100% Protected" />
            <TrustBadge icon={<EasyReturnsIcon className="w-6 h-6"/>} title="Easy Returns" subtitle="30-day policy" />
          </div>

        </div>
      </div>

      <div className="mt-20 space-y-20">
        {/* Description & Specs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-3">
                <Card className="p-8 h-full">
                    <h2 className="text-2xl font-bold text-textDark dark:text-textLight mb-4">Description</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
                </Card>
            </div>
             {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="md:col-span-2">
                    <Card className="p-8 h-full">
                        <h2 className="text-2xl font-bold text-textDark dark:text-textLight mb-4">Specifications</h2>
                        <dl className="space-y-4">
                            {Object.entries(product.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2 text-sm">
                                    <dt className="font-medium text-gray-500 dark:text-gray-400">{key}</dt>
                                    <dd className="text-textDark dark:text-textLight font-semibold text-right">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </Card>
                </div>
            )}
        </div>
      
        {/* Customer Reviews Section */}
        <div id="reviews">
            <h2 className="text-3xl font-bold text-center mb-10 text-textDark dark:text-textLight">Customer Reviews</h2>
            <Card className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        {product.rating ? (
                             <>
                                <p className="text-4xl font-bold text-textDark dark:text-textLight">{product.rating.toFixed(1)} <span className="text-2xl text-gray-400">/ 5</span></p>
                                <StarRating rating={product.rating} />
                                <p className="text-sm text-gray-500 mt-1">Based on {product.reviews?.length || 0} reviews</p>
                            </>
                        ) : <p className="text-lg text-gray-500">This product has no reviews yet.</p>}
                       
                    </div>
                     {user && hasPurchased && !hasReviewed && <Button onClick={() => setReviewModalOpen(true)}>Write a review</Button>}
                </div>
                
                <div className="space-y-6 divide-y divide-gray-200 dark:divide-gray-700">
                  {(product.reviews && product.reviews.length > 0) ? product.reviews.map((review, index) => (
                      <div key={index} className="pt-6 first:pt-0">
                          <div className="flex items-center mb-2">
                              <StarRating rating={review.rating} />
                          </div>
                          <p className="font-semibold text-textDark dark:text-textLight">{review.userName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{new Date(review.date).toLocaleDateString()}</p>
                          <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                      </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>Be the first to share your thoughts on this product!</p>
                    </div>
                  )}
                </div>
            </Card>
        </div>
        
        {/* Q&A Section */}
        <QandASection product={product} />

       {/* Related Products */}
      {relatedProducts.length > 0 && (
          <div>
              <h2 className="text-3xl font-bold text-center mb-10 text-textDark dark:text-textLight">You Might Also Like</h2>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {relatedProducts.map(relatedProduct => (
                      <ProductCard key={relatedProduct.id} product={relatedProduct} />
                  ))}
              </div>
          </div>
      )}
      </div>

      <Modal isOpen={isReviewModalOpen} onClose={() => setReviewModalOpen(false)} title={`Write a review for ${product.name}`}>
          <ReviewForm productId={product.id} onReviewSubmit={() => setReviewModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ProductDetailPage;