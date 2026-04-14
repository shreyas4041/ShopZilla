import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-textDark dark:text-textLight">Terms of Use</h1>
        <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 space-y-4">
          <h2 className="text-2xl font-bold text-textDark dark:text-textLight">1. Terms</h2>
          <p>
            By accessing this Website, accessible from shopzilla.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
          </p>
          <h2 className="text-2xl font-bold text-textDark dark:text-textLight">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on ShopZilla's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on ShopZilla's Website;
          </p>
           <h2 className="text-2xl font-bold text-textDark dark:text-textLight">3. Limitations</h2>
          <p>
           In no event shall ShopZilla or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ShopZilla's Website, even if ShopZilla or an authorize representative of this Website has been notified, orally or in writing, of the possibility of such damage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
