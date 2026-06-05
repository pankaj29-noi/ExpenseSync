import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../components/DashBoard';
import { Wallet, User, Database, Menu, X } from 'lucide-react';
import { useState } from 'react';

const DashPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const getInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Animation variants
  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-950 relative overflow-x-hidden"
    >
      {/* Background Icons - Reduced for mobile performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.02, 0.04, 0.02],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
            className="absolute text-emerald-400/10 hidden sm:block"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + i * 10}%`,
              fontSize: `${16 + i * 2}px`,
            }}
          >
            {['💰', '💸', '📊', '👥', '💳', '⚡', '🎯', '📈'][i]}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-emerald-900/95 to-teal-900/95 backdrop-blur-xl border-b border-emerald-700/50 px-4 sm:px-6 py-3 sm:py-4 shadow-2xl relative z-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.button 
              onClick={handleLogoClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl shadow-emerald-500/30"
              >
                <Wallet size={20} className="sm:w-6 sm:h-6 text-white" />
              </motion.div>
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">ExpenseSync</h1>
                <p className="text-emerald-300 text-xs sm:text-sm leading-tight">Split bills like a pro</p>
              </div>
            </motion.button>

            {/* Desktop Profile - Full Email */}
            <div className="hidden sm:flex items-center space-x-3">
              <motion.button
                onClick={handleProfileClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 bg-emerald-800/40 backdrop-blur-lg px-4 py-2 rounded-xl border border-emerald-700/50 hover:bg-emerald-800/60 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-lg">
                  {getInitial()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">
                    {user?.user_metadata?.name || 'User'}
                  </p>
                  <p className="text-xs text-emerald-300">{user?.email}</p>
                </div>
                <User size={16} className="text-emerald-400" />
              </motion.button>
            </div>

            {/* Mobile Profile - Only First Letter */}
            <motion.button
              onClick={handleProfileClick}
              whileTap={{ scale: 0.9 }}
              className="sm:hidden flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-bold text-lg shadow-lg border-2 border-emerald-400/30"
            >
              {getInitial()}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Added padding for mobile */}
      <main className="relative z-10 pb-20 sm:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Dashboard />
        </motion.div>
      </main>

      {/* Footer - Fixed for mobile */}
      <footer className="bg-gradient-to-r from-emerald-900/95 to-teal-900/95 border-t border-emerald-700/50 py-4 sm:py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Database size={18} className="text-emerald-400" />
              <span className="text-emerald-300 font-medium text-sm sm:text-base">Powered by Supabase</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-emerald-300 text-center">
              {/* <span>© 2025 ExpenseSync. All rights reserved.</span> */}
              <div className="flex space-x-4">
                {/* <button className="hover:text-white transition-colors text-xs sm:text-sm">Privacy</button>
                <button className="hover:text-white transition-colors text-xs sm:text-sm">Terms</button>
                <button className="hover:text-white transition-colors text-xs sm:text-sm">Help</button> */}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Safe Area Spacer */}
      <div className="h-4 sm:h-0" />
    </motion.div>
  );
};

export default DashPage;



