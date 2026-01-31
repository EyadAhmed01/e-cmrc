import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="glass-strong border-t border-white/10 mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 gradient-text">FreshCart</h3>
                        <p className="text-gray-400">
                            Your one-stop shop for fresh groceries and everyday essentials.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/home" className="text-gray-400 hover:text-accent transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-accent transition-colors">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/brands" className="text-gray-400 hover:text-accent transition-colors">
                                    Brands
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Account</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/cart" className="text-gray-400 hover:text-accent transition-colors">
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <Link to="/wishlist" className="text-gray-400 hover:text-accent transition-colors">
                                    Wishlist
                                </Link>
                            </li>
                            <li>
                                <Link to="/order" className="text-gray-400 hover:text-accent transition-colors">
                                    Orders
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex items-center">
                                <i className="fas fa-envelope mr-2 text-accent"></i>
                                support@freshcart.com
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-phone mr-2 text-accent"></i>
                                +20 123 456 7890
                            </li>
                            <li className="flex gap-4 mt-4">
                                <a href="#" className="glass p-2 rounded-lg hover:bg-accent/20 hover:text-accent transition-smooth">
                                    <i className="fab fa-facebook"></i>
                                </a>
                                <a href="#" className="glass p-2 rounded-lg hover:bg-accent/20 hover:text-accent transition-smooth">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="glass p-2 rounded-lg hover:bg-accent/20 hover:text-accent transition-smooth">
                                    <i className="fab fa-instagram"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} FreshCart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
