import React from 'react';

const ShippingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-textDark dark:text-textLight">Shipping Policy</h1>
        <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 space-y-4">
          <h2 className="text-2xl font-bold text-textDark dark:text-textLight">Processing Time</h2>
          <p>
            All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
          </p>
          <h2 className="text-2xl font-bold text-textDark dark:text-textLight">Shipping Rates & Delivery Estimates</h2>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout. We offer Standard Shipping (5-7 business days) and Express Shipping (2-3 business days). Delivery delays can occasionally occur.
          </p>
           <h2 className="text-2xl font-bold text-textDark dark:text-textLight">Shipment Confirmation & Order Tracking</h2>
          <p>
           You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
