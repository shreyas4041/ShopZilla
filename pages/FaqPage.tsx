import React from 'react';

const FaqPage: React.FC = () => {
  const faqs = [
    {
      q: 'What are your shipping options?',
      a: 'We offer standard (5-7 business days) and express (2-3 business days) shipping. Costs are calculated at checkout.'
    },
    {
      q: 'How can I track my order?',
      a: 'Once your order ships, you will receive an email with a tracking number. You can also find tracking information in your account\'s order history.'
    },
    {
      q: 'What is your return policy?',
      a: 'We accept returns on unused items in their original packaging within 30 days of purchase. Please visit our Returns Policy page for more details.'
    }
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-textDark dark:text-textLight">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-semibold text-textDark dark:text-textLight">{faq.q}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
