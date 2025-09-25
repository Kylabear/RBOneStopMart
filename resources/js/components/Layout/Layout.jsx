import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col relative">
            <Header />
            <main className="flex-1 relative z-10">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
