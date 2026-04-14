import React from 'react';

const ReturnsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-textDark dark:text-textLight">Returns Policy</h1>
        <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 space-y-4">
          <p>
            Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we can’t offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
          </p>
          <h2 className="text-2xl font-bold text-textDark dark:text-textLight">Refunds</h2>
          <p>
            Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your original method of payment, within a certain amount of days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
