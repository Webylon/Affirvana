import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex pt-16">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Navigation Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="fixed top-16 w-64 h-[calc(100vh-4rem)] overflow-y-auto">
            <Navigation 
              isOpen={isMobileMenuOpen} 
              onClose={() => setIsMobileMenuOpen(false)} 
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Navigation 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] w-full max-w-[1920px] mx-auto">
          <div className="h-full px-4 lg:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;