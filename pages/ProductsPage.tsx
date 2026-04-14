// Fix: Created this file to implement the products page and resolve the module import error in App.tsx.

import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductContext, AppContext } from '../App';
import ProductCard from '../components/ProductCard';
import ProductSkeletonCard from '../components/ProductSkeletonCard';
import { Card, Input } from '../components/ui';

const ProductsPage: React.FC = () => {
  const { products } = useContext(ProductContext);
  const { isLoading } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedMainCategory, setSelectedMainCategory] = useState(searchParams.get('category') || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState(searchParams.get('subCategory') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || '');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(searchParams.get('ageGroup') || '');
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    // Sync state with URL params on initial load or param change
    setSearchTerm(searchParams.get('q') || '');
    setSelectedMainCategory(searchParams.get('category') || '');
    setSelectedSubCategory(searchParams.get('subCategory') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setSelectedGender(searchParams.get('gender') || '');
    setSelectedAgeGroup(searchParams.get('ageGroup') || '');
  }, [searchParams]);
  
  const categories = useMemo(() => {
    const mainCategories: { [key: string]: Set<string> } = {};
    products.forEach(p => {
        if (!mainCategories[p.categories.main]) {
            mainCategories[p.categories.main] = new Set();
        }
        mainCategories[p.categories.main].add(p.categories.sub);
    });
    return mainCategories;
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p => p.status === 'approved');

    if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedMainCategory) filtered = filtered.filter(p => p.categories.main === selectedMainCategory);
    if (selectedSubCategory) filtered = filtered.filter(p => p.categories.sub === selectedSubCategory);
    if (selectedBrand) filtered = filtered.filter(p => p.brand === selectedBrand);
    if (selectedGender) filtered = filtered.filter(p => p.categories.gender === selectedGender);
    if (selectedAgeGroup) filtered = filtered.filter(p => p.categories.ageGroup === selectedAgeGroup);

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating-desc': filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: break;
    }

    return filtered;
  }, [products, searchTerm, selectedMainCategory, selectedSubCategory, selectedBrand, selectedGender, selectedAgeGroup, priceRange, sortBy]);
  
  const updateUrlParams = (key: string, value: string) => {
    setSearchParams(params => {
        if (value) params.set(key, value);
        else params.delete(key);
        return params;
    });
  };

  const handleMainCategoryChange = (category: string) => {
    const newMainCategory = selectedMainCategory === category ? '' : category;
    setSelectedMainCategory(newMainCategory);
    setSelectedSubCategory('');
    setSearchParams(params => {
        if (newMainCategory) params.set('category', newMainCategory);
        else params.delete('category');
        params.delete('subCategory');
        return params;
    });
  };

  const handleSubCategoryChange = (subCategory: string) => {
    const newSubCategory = selectedSubCategory === subCategory ? '' : subCategory;
    setSelectedSubCategory(newSubCategory);
    updateUrlParams('subCategory', newSubCategory);
  };
  
  const handleGenderChange = (gender: string) => {
      const newGender = selectedGender === gender ? '' : gender;
      setSelectedGender(newGender);
      updateUrlParams('gender', newGender);
  }
  
  const handleAgeGroupChange = (ageGroup: string) => {
      const newAgeGroup = selectedAgeGroup === ageGroup ? '' : ageGroup;
      setSelectedAgeGroup(newAgeGroup);
      updateUrlParams('ageGroup', newAgeGroup);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    updateUrlParams('q', newSearchTerm);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-textDark dark:text-textLight">Our Products</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Explore our curated collection of high-quality items.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4 text-textDark dark:text-textLight">Filters</h2>
            <div className="space-y-6">
              <Input label="Search" id="search" value={searchTerm} onChange={handleSearchChange} placeholder="Search products..."/>

              <div>
                <h3 className="font-semibold mb-2 text-textDark dark:text-textLight">Gender</h3>
                <div className="flex flex-wrap gap-2">
                  {['Men', 'Women', 'Unisex'].map(g => <button key={g} onClick={() => handleGenderChange(g)} className={`px-3 py-1 text-xs rounded-full border ${selectedGender === g ? 'bg-accent text-white border-accent' : 'bg-transparent border-gray-300 dark:border-gray-600'}`}>{g}</button>)}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-textDark dark:text-textLight">Age Group</h3>
                <div className="flex flex-wrap gap-2">
                  {['Adult', 'Kids'].map(ag => <button key={ag} onClick={() => handleAgeGroupChange(ag)} className={`px-3 py-1 text-xs rounded-full border ${selectedAgeGroup === ag ? 'bg-accent text-white border-accent' : 'bg-transparent border-gray-300 dark:border-gray-600'}`}>{ag}</button>)}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-textDark dark:text-textLight">Category</h3>
                <div className="space-y-2">
                  {Object.keys(categories).map(mainCat => (
                    <div key={mainCat}>
                        <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 font-bold">
                        <input type="checkbox" checked={selectedMainCategory === mainCat} onChange={() => handleMainCategoryChange(mainCat)} className="rounded text-accent focus:ring-accent"/>
                        <span>{mainCat}</span>
                        </label>
                        {selectedMainCategory === mainCat && (
                            <div className="pl-6 mt-2 space-y-2">
                                {[...categories[mainCat]].map(subCat => (
                                     <label key={subCat} className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                                        <input type="checkbox" checked={selectedSubCategory === subCat} onChange={() => handleSubCategoryChange(subCat)} className="rounded text-accent focus:ring-accent"/>
                                        <span>{subCat}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-textDark dark:text-textLight">Price Range</h3>
                <input type="range" min="0" max="1500" value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>$0</span><span>${priceRange[1]}</span></div>
              </div>
              
               <div>
                <h3 className="font-semibold mb-2 text-textDark dark:text-textLight">Sort By</h3>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-primary border-gray-300 dark:border-gray-600">
                    <option value="relevance">Relevance</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                </select>
               </div>
            </div>
          </Card>
        </aside>

        <main className="lg:col-span-3">
            {isLoading ? ( <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 9 }).map((_, i) => <ProductSkeletonCard key={i} />)}</div> ) : 
            filteredAndSortedProducts.length > 0 ? ( <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">{filteredAndSortedProducts.map(product => (<ProductCard key={product.id} product={product} />))}</div> ) : 
            ( <div className="text-center py-20"><h2 className="text-2xl font-semibold text-textDark dark:text-textLight">No Products Found</h2><p className="mt-2 text-gray-500">Try adjusting your filters to find what you're looking for.</p></div> )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;