import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-textDark dark:text-textLight">Privacy Policy</h1>
        <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 space-y-4">
          <p>
            Your privacy is important to us. It is ShopZilla's policy to respect your privacy regarding any information we may collect from you across our website.
          </p>
          <h2 className="text-2xl font-bold text-textDark dark:text-textLight">1. Information we collect</h2>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
          </p>
          <h2 className="text-2xl font-bold text-textDark dark:text-textLight">2. How we use your information</h2>
          <p>
            We use the information we collect in various ways, including to: provide, operate, and maintain our website, improve, personalize, and expand our website, understand and analyze how you use our website, develop new products, services, features, and functionality, and communicate with you.
          </p>
           <h2 className="text-2xl font-bold text-textDark dark:text-textLight">3. Security</h2>
          <p>
           We take the security of your data seriously and use industry-standard encryption to protect your information. However, no method of transmission over the Internet is 100% secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
