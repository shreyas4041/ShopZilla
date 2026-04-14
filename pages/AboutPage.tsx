import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-textDark dark:text-textLight">About ShopZilla</h1>
        <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300">
          <p>
            Welcome to ShopZilla, your number one source for everything. We're dedicated to giving you the very best of products, with a focus on dependability, customer service and uniqueness.
          </p>
          <p>
            Founded in {new Date().getFullYear()} by a team of passionate developers, ShopZilla has come a long way from its beginnings. When we first started out, our passion for creating a better, more accessible online shopping experience drove us to action, and gave us the impetus to turn hard work and inspiration into to a booming online store. We now serve customers all over the world, and are thrilled to be a part of the quirky, eco-friendly, fair trade wing of the e-commerce industry.
          </p>
          <p>
            We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
