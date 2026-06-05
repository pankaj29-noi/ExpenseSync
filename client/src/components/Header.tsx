import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Menu, X, Wallet, PieChart, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const goToLogPage = () => {
    // console.log('Navigating to /log...');
    navigate('/log');
    setIsMobileMenuOpen(false);
    
   
  };

  
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate('/')}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <motion.div 
                className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center"
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
              >
                <Wallet size={16} className="text-gray-950" />
              </motion.div>
              
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                ExpenseSync
              </span>
            </motion.div>

            {/* Desktop - Right Side */}
            <div className="hidden sm:flex items-center space-x-6">
              <motion.a 
                href="https://github.com/100NikhilBro/ExpenseSync" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={22} />
              </motion.a>
              
              <div className="flex items-center space-x-4">
                <motion.button 
                  onClick={goToLogPage}
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                
                <motion.button 
                  onClick={goToLogPage}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-gray-950 px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-500/20"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="sm:hidden text-gray-300 hover:text-green-400 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 300 
              }}
              className="sm:hidden fixed top-0 right-0 h-full w-4/5 max-w-sm bg-gray-900 border-l border-gray-800 z-50 overflow-y-auto"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-end mb-8">
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-400 hover:text-green-400 p-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                <div className="flex-1 flex flex-col space-y-8">
                  <motion.a
                    href="https://github.com/100NikhilBro/ExpenseSync" 
                    className="flex items-center space-x-4 text-gray-300 hover:text-green-400 transition-colors duration-200 p-4 bg-gray-800/50 rounded-xl"
                    whileHover={{ 
                      x: 10,
                      scale: 1.02,
                      backgroundColor: "rgba(30, 41, 59, 0.8)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="p-2 bg-gray-700 rounded-lg">
                      <Github size={20} />
                    </div>
                    <span className="font-medium">GitHub Repository</span>
                  </motion.a>

                  <div className="flex flex-col space-y-4">
                    <motion.button
                      onClick={goToLogPage}
                      className="w-full text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium py-4 px-6 text-left border border-gray-700 rounded-xl"
                      whileHover={{ 
                        x: 10,
                        scale: 1.02,
                        borderColor: "#10b981",
                        backgroundColor: "rgba(16, 185, 129, 0.1)"
                      }}
                      whileTap={{ 
                        scale: 0.98,
                        backgroundColor: "rgba(16, 185, 129, 0.2)"
                      }}
                    >
                      Login to Account
                    </motion.button>
                    
                    <motion.button
                      onClick={goToLogPage}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-gray-950 py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-500/20 flex items-center justify-center space-x-3"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.5)",
                        y: -2
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        y: 0
                      }}
                    >
                      <Wallet size={20} />
                      <span className="font-bold">Create Free Account</span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <motion.div
                      className="flex flex-col items-center text-gray-400 p-4 bg-gray-800/50 rounded-xl"
                      whileHover={{ 
                        scale: 1.1, 
                        color: "#10b981",
                        y: -5
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Wallet size={24} />
                      <span className="text-xs mt-2 font-medium">Expenses</span>
                    </motion.div>
                    <motion.div
                      className="flex flex-col items-center text-gray-400 p-4 bg-gray-800/50 rounded-xl"
                      whileHover={{ 
                        scale: 1.1, 
                        color: "#10b981",
                        y: -5
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PieChart size={24} />
                      <span className="text-xs mt-2 font-medium">Analytics</span>
                    </motion.div>
                    <motion.div
                      className="flex flex-col items-center text-gray-400 p-4 bg-gray-800/50 rounded-xl"
                      whileHover={{ 
                        scale: 1.1, 
                        color: "#10b981",
                        y: -5
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Receipt size={24} />
                      <span className="text-xs mt-2 font-medium">Bills</span>
                    </motion.div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-800">
                  <p className="text-gray-500 text-sm text-center">
                    Track expenses effortlessly
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
