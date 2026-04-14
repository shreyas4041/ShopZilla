// Fix: Created this file to provide the FeaturedPromotionBanner component and resolve build errors.
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PromotionContext } from '../App';
import { Card, Button } from './ui';

const FeaturedPromotionBanner: React.FC = () => {
    const { promotions } = useContext(PromotionContext);

    // Let's feature the first promotion, or return null if none exist.
    const featuredPromo = promotions[0];

    if (!featuredPromo) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-12">
            <Card className="relative overflow-hidden p-0">
                <img src={featuredPromo.imageUrl} alt={featuredPromo.title} className="w-full h-48 object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20 flex items-center p-8">
                    <div className="text-white max-w-md">
                        <h2 className="text-3xl font-bold">{featuredPromo.title}</h2>
                        <p className="mt-2 text-gray-200">{featuredPromo.subtitle}</p>
                        <Link to={featuredPromo.link}>
                            <Button className="mt-4">Shop Now</Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default FeaturedPromotionBanner;
