import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PromotionContext } from '../App';
import { Button } from './ui';

const HeroSlider: React.FC = () => {
  const { promotions } = useContext(PromotionContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (promotions.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [promotions.length]);

  if (promotions.length === 0) {
    return null; // Don't render if there are no promotions
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + promotions.length) % promotions.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
  };
  
  const currentPromotion = promotions[currentIndex];

  return (
    <section className="relative w-full h-[60vh] text-white overflow-hidden">
       {promotions.map((promo, index) => (
         <div key={promo.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
            <img 
                src={promo.imageUrl} 
                alt={promo.title} 
                className="w-full h-full object-cover" 
                loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-black/50"></div>
         </div>
       ))}
      
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-2xl animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                {currentPromotion.title}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-200">
                {currentPromotion.subtitle}
            </p>
            <Link to={currentPromotion.link} className="mt-8 inline-block">
                <Button className="px-8 py-3 text-lg">Shop Now</Button>
            </Link>
        </div>
      </div>
      
       {/* Slider Controls */}
        <button onClick={goToPrevious} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
        
        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {promotions.map((_, index) => (
                <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-accent' : 'bg-white/50 hover:bg-white'}`}></button>
            ))}
        </div>
    </section>
  );
};

export default HeroSlider;