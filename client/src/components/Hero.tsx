import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, CheckCircle2, TrendingUp, Users, Wallet, Group, RatioIcon } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  const expenses = [
    { id: 1, name: "Groceries", amount: "$45.20", time: "2 min ago", user: "You", approved: true },
    { id: 2, name: "Dinner", amount: "$85.50", time: "1 hour ago", user: "Alex", approved: false },
    { id: 3, name: "Uber Ride", amount: "$23.75", time: "3 hours ago", user: "Sarah", approved: true },
    { id: 4, name: "Netflix", amount: "$15.99", time: "5 hours ago", user: "You", approved: true },
    { id: 5, name: "Coffee", amount: "$12.80", time: "1 day ago", user: "Mike", approved: false },
    { id: 6, name: "Electricity", amount: "$65.30", time: "2 days ago", user: "You", approved: true },
    { id: 7, name: "Movie Tickets", amount: "$32.00", time: "2 days ago", user: "Sarah", approved: false },
  ];

  const [currentExpenses, setCurrentExpenses] = useState(expenses.slice(0, 5));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % expenses.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [expenses.length]);

  useEffect(() => {
    const visibleExpenses = [];
    for (let i = 0; i < 5; i++) {
      const index = (currentIndex + i) % expenses.length;
      visibleExpenses.push(expenses[index]);
    }
    setCurrentExpenses(visibleExpenses);
  }, [currentIndex]);

  const goToLogPage = () => {
    navigate('/log');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const expenseVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }
    }),
    exit: { y: -20, opacity: 0 }
  };

  return (
    <section className="min-h-[30vh] bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 pt-28 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

          {/* LEFT SIDE */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 order-2 lg:order-1"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center space-x-2 bg-gray-800/50 border border-green-500/20 rounded-full px-4 py-2"
              >
                <TrendingUp size={16} className="text-green-400" />
                <span className="text-green-400 text-sm font-medium">Split expenses effortlessly</span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Split Bills
                </span>
                <br />
                <span className="text-white">Like a Pro</span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-lg"
              >
                ExpenseSync helps you track, split, and manage shared expenses with friends, roommates, and groups. Never worry about who owes what again.
              </motion.p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 sm:gap-5">
              <div className="flex items-center space-x-2">
                <Users size={20} className="text-green-400" />
                <span className="text-white font-semibold">Widely adopted</span>
                {/* <span className="text-gray-400">Users</span> */}
              </div>
              <div className="flex items-center space-x-2">
                <Wallet size={20} className="text-green-400" />
                <span className="text-white font-semibold">Scalable tracking</span>
                {/* <span className="text-gray-400">Tracked</span> */}
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={20} className="text-green-400" />
                <span className="text-white font-semibold">Excellent user experience</span>
                {/* <span className="text-gray-400">Satisfaction</span> */}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={goToLogPage}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-gray-950 px-6 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center space-x-3 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-2xl shadow-green-500/30"
              >
                <span>Start for Free</span>
                <ArrowRight size={20} />
              </motion.button>

              <motion.button
                onClick={goToLogPage}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="border border-gray-600 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg hover:border-green-400 transition-all duration-200"
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative order-1 lg:order-2 mb-4 lg:mb-0"
          >
            <div className="relative bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-gray-700 max-w-md mx-auto lg:max-w-none lg:mr-auto lg:ml-0">

              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">ExpenseSync Dashboard</div>
                <div className="w-4 sm:w-6"></div>
              </div>

              <div className="bg-gray-900 rounded-xl p-3 sm:p-4 border border-gray-700">
                
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-white font-bold text-base sm:text-lg">Recent Expenses</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-green-500 text-gray-900 p-1 sm:p-2 rounded-lg text-xs sm:text-base"
                  >
                    <Plus size={12} className="sm:size-[14px]" />
                  </motion.button>
                </div>

                <div className="space-y-2 sm:space-y-3 min-h-[200px] sm:min-h-[240px] relative">
                  <AnimatePresence mode="popLayout">
                    {currentExpenses.map((expense, index) => (
                      <motion.div
                        key={`${expense.id}-${currentIndex}-${index}`}
                        custom={index}
                        variants={expenseVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex items-center justify-between p-2 sm:p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-green-400/30 transition-colors duration-200"
                        layout
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className={`w-2 h-2 rounded-full ${expense.approved ? 'bg-green-400' : 'bg-cyan-400'}`}></div>
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-medium text-sm sm:text-base truncate">{expense.name}</div>
                            <div className="text-gray-400 text-xs sm:text-sm truncate">{expense.user} • {expense.time}</div>
                          </div>
                        </div>
                        <div className="text-white font-bold text-sm sm:text-base whitespace-nowrap ml-2">{expense.amount}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="flex justify-between items-center mt-3 sm:mt-4 pt-3 border-t border-gray-700"
                >
                  <div className="text-gray-400 text-xs sm:text-sm">Total This Month</div>
                  <div className="text-green-400 font-bold text-base sm:text-lg">$183.24</div>
                </motion.div>
              </div>
            </div>

            {/* REAL-TIME BADGE WITH ICON + COMING SOON */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 
                         bg-gradient-to-r from-green-400 to-emerald-500 
                         text-gray-900 px-2 py-1 sm:px-4 sm:py-2 
                         rounded-lg sm:rounded-xl font-bold 
                         text-[10px] sm:text-sm shadow-lg z-10 flex flex-col gap-0.5 sm:gap-1 items-center"
            >
              <div className="flex items-center gap-1 sm:gap-2 leading-none">
                <RatioIcon size={12} className="sm:size-[16px]" />
                <span className="text-[10px] sm:text-sm">Real-time Sync</span>
              </div>

              {/* Coming Soon */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-emerald-500/20 
                              text-emerald-300 border border-emerald-400/40 
                              rounded-full px-1.5 py-0.5 sm:px-2 sm:py-[1px] 
                              font-semibold text-[8px] sm:text-[10px] 
                              tracking-wide shadow-[0_0_6px_rgba(52,211,153,0.3)]">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="text-[8px] sm:text-[10px]">COMING SOON</span>
              </div>
            </motion.div>

            {/* GROUP EXPENSE BADGE */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-gradient-to-r 
                         from-green-400 to-emerald-500 text-gray-900 
                         px-2 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl 
                         font-bold text-[10px] sm:text-sm shadow-lg z-10"
            >
              <div className='flex gap-1 sm:gap-2 items-center'>
                <Group size={12} className="sm:size-[16px]" />
                <p className="text-[10px] sm:text-sm">Group Expenses</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
