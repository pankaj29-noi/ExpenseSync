import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HandCoins, User, IndianRupee, ArrowRight, Clock, CheckCircle, TrendingUp, Wallet, Sparkles } from 'lucide-react';



interface SettlementTabProps {
  settlements: any[];
  groupMembers: any[];
  formatName: (name: string) => string;
  getTimeAgo: (date: string) => string;
  getSettlementInfo: (expense: any) => { from: string; to: string; amount: string };
  getOriginalExpenseReference: (expense: any) => string;
}

const SettlementTab: React.FC<SettlementTabProps> = ({
  settlements,
  groupMembers,
  formatName,
  getTimeAgo,
  getSettlementInfo,
  getOriginalExpenseReference
}) => {
  const settlementCardVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      y: -2,
      boxShadow: "0 10px 30px -8px rgba(147, 51, 234, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  // Creative settlement status based on amount and time
  const getSettlementStatus = (amount: string, date: string) => {
    const amountNum = parseFloat(amount);
    const settlementDate = new Date(date);
    const now = new Date();
    const daysAgo = Math.floor((now.getTime() - settlementDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (amountNum > 1000) return { text: 'Major', color: 'text-purple-400', bg: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20' };
    if (daysAgo < 1) return { text: 'Recent', color: 'text-green-400', bg: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' };
    if (daysAgo < 7) return { text: 'This Week', color: 'text-blue-400', bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20' };
    
    return { text: 'Completed', color: 'text-gray-400', bg: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20' };
  };

  if (!settlements || settlements.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 p-6 sm:p-8 text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
        >
          <HandCoins size={24} className="text-white sm:w-7 sm:h-7" />
        </motion.div>
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No settlements yet</h3>
        <p className="text-emerald-200/80 text-xs sm:text-sm mb-4 max-w-md mx-auto">
          Settlements will appear here when you settle balances
        </p>
        <div className="flex items-center justify-center gap-2 text-purple-300/60">
          <Wallet size={14} className="sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">Balances settled will show here</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Settlement Summary - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500/10 to-indigo-600/10 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-purple-500/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg"
            >
              <TrendingUp size={16} className="text-white sm:w-5 sm:h-5" />
            </motion.div>
            <div>
              <h3 className="text-white font-semibold text-xs sm:text-sm">Settlement History</h3>
              <p className="text-purple-300 text-[10px] sm:text-xs">{settlements.length} transactions</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-base sm:text-lg">
              ₹{settlements.reduce((sum, s) => sum + parseFloat(s.amount), 0).toLocaleString()}
            </p>
            <p className="text-purple-300 text-[10px] sm:text-xs">Total settled</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {settlements.map((expense, index) => {
          const settlementInfo = getSettlementInfo(expense);
          const expenseReference = getOriginalExpenseReference(expense);
          const status = getSettlementStatus(settlementInfo.amount, expense.createdAt);
          
          return (
            <motion.div
              key={expense.id}
              variants={settlementCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              whileHover="hover"
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-purple-500/30 hover:border-purple-500/50 p-3 sm:p-4 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              />

              <div className="relative z-10">
                {/* Header Section - Mobile Optimized */}
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <HandCoins size={14} className="text-purple-400 sm:w-4 sm:h-4" />
                    </motion.div>
                    <span className="text-purple-400 text-xs font-semibold uppercase tracking-wide">
                      #{index + 1}
                    </span>
                  </div>
                  
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle size={12} className="text-green-400 sm:w-3.5 sm:h-3.5" />
                  </motion.div>
                </div>

                {/* Users and Arrow Section - Mobile Optimized */}
                <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3">
                  {/* From User */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User size={12} className="text-white sm:w-4 sm:h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-purple-200 text-xs sm:text-sm font-semibold truncate">
                        {formatName(settlementInfo.from)}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <TrendingUp size={10} className="text-red-400 sm:w-3 sm:h-3" />
                        <p className="text-red-400 text-[10px] sm:text-xs font-medium">Paid</p>
                      </div>
                    </div>
                  </div>

                  {/* Animated Arrow - Mobile Optimized */}
                  <motion.div
                    className="flex items-center px-1 sm:px-2"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="relative">
                      <ArrowRight size={16} className="text-purple-400 sm:w-5 sm:h-5" />
                      <motion.div
                        className="absolute inset-0"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles size={16} className="text-yellow-400 sm:w-5 sm:h-5" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* To User */}
                  <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                    <div className="flex-1 min-w-0 text-right">
                      <p className="text-green-200 text-xs sm:text-sm font-semibold truncate">
                        {formatName(settlementInfo.to)}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 justify-end">
                        <TrendingUp size={10} className="text-green-400 sm:w-3 sm:h-3 transform rotate-180" />
                        <p className="text-green-400 text-[10px] sm:text-xs font-medium">Received</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User size={12} className="text-white sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>

                {/* Amount Section */}
                <div className="mb-3">
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-lg"
                        animate={{
                          boxShadow: [
                            '0 0 0px rgba(147, 51, 234, 0.3)',
                            '0 0 8px rgba(147, 51, 234, 0.5)',
                            '0 0 0px rgba(147, 51, 234, 0.3)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-white font-bold text-xs sm:text-sm flex items-center gap-1">
                          <IndianRupee size={12} className="text-purple-100" />
                          {parseFloat(settlementInfo.amount).toFixed(2)}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Status and Time - Mobile Optimized */}
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${status.bg} ${status.color} border border-current/20`}>
                    {status.text}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-gray-500 sm:w-3 sm:h-3" />
                    <span className="text-gray-500 text-[10px] sm:text-xs">
                      {getTimeAgo(expense.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Expense Reference */}
                <div className="mt-2 text-center border-t border-purple-500/20 pt-2">
                  <span className="text-purple-200/80 text-[10px] sm:text-xs">
                    For <span className="text-purple-300 font-medium">{expenseReference}</span>
                  </span>
                </div>
              </div>

              {/* Floating Sparkles Effect */}
              <motion.div
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <Sparkles size={14} className="text-purple-400 sm:w-4 sm:h-4" />
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default SettlementTab;



