
import React from 'react';
import { Link } from 'react-router-dom';
import { GithubIcon, TwitterIcon, DribbbleIcon } from './Icons';

const Footer: React.FC = () => {
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];
  const legalLinks = [
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Shipping Policy', path: '/shipping' },
    { name: 'Returns Policy', path: '/returns' },
  ];

  return (
    <footer className="bg-secondary text-textLight border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-accent">ShopZilla</h2>
            <p className="mt-2 text-sm text-gray-400">
              The 'everything store' reimagined. Modern, bold, and seamless.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors"><GithubIcon className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors"><TwitterIcon className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors"><DribbbleIcon className="w-5 h-5"/></a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              {legalLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Newsletter</h3>
            <p className="mt-4 text-sm text-gray-400">Subscribe for updates and promotions.</p>
            <form className="mt-4 flex">
              <input type="email" placeholder="Your email" className="w-full px-3 py-2 text-sm text-textDark bg-textLight border border-transparent rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent" />
              <button type="submit" className="px-4 py-2 bg-accent text-white font-semibold rounded-r-md hover:bg-accent-hover transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ShopZilla. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
