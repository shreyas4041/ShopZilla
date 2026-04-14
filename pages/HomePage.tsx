import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { AppContext, ProductContext } from '../App';
import { Button } from '../components/ui';
import AnimatedSection from '../components/AnimatedSection';
import HeroSlider from '../components/HeroSlider';
import ProductSkeletonCard from '../components/ProductSkeletonCard';
import { brands } from '../data';

// Icons
const StoreIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /> </svg> );
const ArrowRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /> </svg> );
const BeautyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0a4 4 0 100 8h1.084a4 4 0 003.916-3.916V15m0 0l-3-3m0 0l-3 3m3-3v12" /></svg>;
const BooksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const ClothingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ElectronicsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const SportsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" /></svg>;

const categories = [
    { name: 'Beauty', description: 'Beauty and personal care products', Icon: BeautyIcon },
    { name: 'Books', description: 'Books and educational materials', Icon: BooksIcon },
    { name: 'Fashion', description: 'Fashion and apparel', Icon: ClothingIcon },
    { name: 'Electronics', description: 'Electronic devices and gadgets', Icon: ElectronicsIcon },
    { name: 'Home & Kitchen', description: 'Home improvement and kitchen supplies', Icon: HomeIcon },
    { name: 'Groceries', description: 'Sports equipment and accessories', Icon: SportsIcon },
]

const HomePage: React.FC = () => {
  const { products: allProducts } = useContext(ProductContext);
  const { isLoading } = useContext(AppContext);
  
  const featuredProducts = useMemo(() => {
    return allProducts.filter(p => p.status === 'approved').slice(0, 4)
  }, [allProducts]);

  return (
    <div className="space-y-16 pb-16">
      <HeroSlider />

      {/* Discover Section */}
      <AnimatedSection>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <div className="inline-flex items-center justify-center bg-accent/10 px-4 py-2 rounded-full text-sm font-semibold text-accent">
                    <StoreIcon />
                    <span>Your Everything Store</span>
                </div>
                <h2 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight text-textDark dark:text-textLight">
                    Discover Amazing <span className="text-accent">Products</span>
                </h2>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                    Shop from millions of products across all categories with fast, free shipping and unbeatable prices.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/products">
                        <Button className="px-8 py-3 text-base w-full sm:w-auto">Shop Now <ArrowRightIcon /></Button>
                    </Link>
                    <Link to="/products">
                        <Button variant="outline" className="px-8 py-3 text-base w-full sm:w-auto">Browse Categories</Button>
                    </Link>
                </div>
            </div>

            <div className="mt-20 border-t border-gray-200 dark:border-gray-800 pt-16 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-12 sm:gap-x-8">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-accent">1M+</p>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Products</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-accent">500K+</p>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Happy Customers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-accent">4.9<span className="text-2xl align-middle">★</span></p>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Rating</p>
                    </div>
                </div>
            </div>
        </section>
      </AnimatedSection>


      {/* Shop by Category Section */}
      <AnimatedSection>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center tracking-tight text-textDark dark:text-textLight">Shop by Category</h2>
          <div className="mt-10 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.map(({ name, description, Icon }) => (
              <Link to={`/products?category=${encodeURIComponent(name)}`} key={name} className="bg-white dark:bg-secondary p-6 rounded-lg text-center flex flex-col items-center hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 border border-gray-200 dark:border-gray-800">
                  <Icon />
                  <h3 className="mt-4 font-bold text-lg text-textDark dark:text-textLight">{name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
              </Link>
            ))}
          </div>
        </section>
      </AnimatedSection>
      
      {/* Shop by Brand Section */}
      <AnimatedSection>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center tracking-tight text-textDark dark:text-textLight">Shop by Brand</h2>
          <div className="mt-10 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-center">
            {brands.map((brand) => (
              <Link to={brand.link} key={brand.name} className="bg-white dark:bg-secondary p-6 rounded-lg text-center flex flex-col items-center justify-center h-full hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 border border-gray-200 dark:border-gray-800">
                  <img src={brand.logoUrl} alt={`${brand.name} logo`} className="h-12 object-contain" />
              </Link>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Shop by Audience Section */}
      <AnimatedSection>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center tracking-tight text-textDark dark:text-textLight">Shop by Audience</h2>
          <div className="mt-10 grid gap-6 grid-cols-1 md:grid-cols-3">
              <Link to="/products?gender=Women" className="relative h-64 rounded-lg overflow-hidden group">
                  <img src="https://picsum.photos/seed/womenfashion/800/600" alt="Shop for Women" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <h3 className="text-3xl font-bold text-white">For Women</h3>
                  </div>
              </Link>
              <Link to="/products?gender=Men" className="relative h-64 rounded-lg overflow-hidden group">
                  <img src="https://picsum.photos/seed/menfashion/800/600" alt="Shop for Men" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <h3 className="text-3xl font-bold text-white">For Men</h3>
                  </div>
              </Link>
              <Link to="/products?ageGroup=Kids" className="relative h-64 rounded-lg overflow-hidden group">
                  <img src="https://picsum.photos/seed/kidsfashion/800/600" alt="Shop for Kids" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <h3 className="text-3xl font-bold text-white">For Kids</h3>
                  </div>
              </Link>
          </div>
        </section>
      </AnimatedSection>


      {/* Featured Products Section */}
      <AnimatedSection>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
              <div>
                  <h2 className="text-4xl font-bold tracking-tight text-textDark dark:text-textLight">Featured Products</h2>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Discover our handpicked selection of trending products across all categories</p>
              </div>
              <Link to="/products">
                  <Button variant="outline">View All Products &rarr;</Button>
              </Link>
          </div>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <ProductSkeletonCard key={i} />)
            ) : (
                featuredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))
            )}
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default HomePage;