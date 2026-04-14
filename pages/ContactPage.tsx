import React from 'react';
import { Button, Input } from '../components/ui';
import { Card } from '../components/ui';

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-textDark dark:text-textLight">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>
      <Card className="max-w-xl mx-auto mt-10 p-8">
        <form className="space-y-6">
          <Input label="Your Name" id="name" name="name" type="text" placeholder="John Doe" required />
          <Input label="Your Email" id="email" name="email" type="email" placeholder="you@example.com" required />
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="block w-full px-4 py-3 border rounded-md shadow-sm sm:text-sm bg-white dark:bg-primary border-gray-300 dark:border-gray-600 text-textDark dark:text-textLight focus:ring-accent focus:border-accent"
              placeholder="Your message..."
              required
            ></textarea>
          </div>
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </Card>
    </div>
  );
};

export default ContactPage;
