import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calculator, Smartphone, Monitor, Shield, Zap, IndianRupee, TrendingUp } from 'lucide-react';

const Bento: React.FC = () => {
  const navigate = useNavigate();

  const goToLogPage = () => {
    navigate('/log');
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-4 sm:mb-6"
          >
            <Zap size={16} className="text-green-400" />
            <span className="text-green-400 text-sm font-medium">Production Ready • No Setup Required</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
              Split Expenses
            </span>
            <br />
            <span className="text-white text-xl sm:text-2xl lg:text-3xl xl:text-4xl">
              Settle Automatically
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Track shared expenses, see who owes whom, and get settlement suggestions instantly.
            <span className="block text-sm sm:text-base text-gray-400 mt-2">
              Built with production-grade architecture • Normalized database • Minimal settlement algorithm
            </span>
          </motion.p>
        </motion.div>

        {/* Features Grid - 3 columns on mobile, 4 on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-10 sm:mb-14"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {/* Feature 1 - Group Expenses */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-xl p-4 sm:p-6 text-center backdrop-blur-sm hover:border-green-400/30 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-full mb-3 sm:mb-4 mx-auto"
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </motion.div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Group Expenses</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Track shared expenses with friends, roommates, or colleagues</p>
            </motion.div>

            {/* Feature 2 - Auto Settlement */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-xl p-4 sm:p-6 text-center backdrop-blur-sm hover:border-green-400/30 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: -5, scale: 1.1 }}
                className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-full mb-3 sm:mb-4 mx-auto"
              >
                <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </motion.div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Auto Settlement</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Minimal transaction algorithm • Zero balances automatically</p>
            </motion.div>

            {/* Feature 3 - Mobile Friendly */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-xl p-4 sm:p-6 text-center backdrop-blur-sm hover:border-green-400/30 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-full mb-3 sm:mb-4 mx-auto"
              >
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </motion.div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Mobile Friendly</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Optimized for phones • Touch-friendly interface</p>
            </motion.div>

            {/* Feature 4 - Desktop Ready */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-xl p-4 sm:p-6 text-center backdrop-blur-sm hover:border-green-400/30 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: -5, scale: 1.1 }}
                className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-full mb-3 sm:mb-4 mx-auto"
              >
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </motion.div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Desktop Ready</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Full experience on computers • Real-time sync</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Main CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-3xl lg:max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 backdrop-blur-sm text-center relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mb-6 sm:mb-8 relative z-10"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 sm:mb-6 mx-auto"
              >
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-gray-950" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                Start Tracking for Free
              </h3>
              <p className="text-gray-300 text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 leading-relaxed">
                <span className="inline-flex items-center gap-1 sm:gap-2">
                  <IndianRupee size={18} className="text-green-400" />
                  <span>Add expenses • Calculate splits • Settle debts</span>
                </span>
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  No credit card required
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Works on all devices
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Instant setup
                </span>
              </div>
            </motion.div>
            
            <motion.button
              onClick={goToLogPage}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-gray-950 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg lg:text-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-2xl shadow-green-500/30 flex items-center justify-center space-x-2 sm:space-x-3 mx-auto w-full sm:w-auto min-w-[180px] relative z-10"
            >
              <span>Try ExpenseSync</span>
              <ArrowRight size={20} className="sm:w-5 sm:h-5" />
            </motion.button>

            {/* Tech Stack Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700/50"
            >
              <p className="text-gray-400 text-xs sm:text-sm mb-2">Production-grade tech stack:</p>
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400">
                <span className="px-2 py-1 bg-gray-800/50 rounded">PostgreSQL</span>
                <span className="px-2 py-1 bg-gray-800/50 rounded">Redis Cache</span>
                <span className="px-2 py-1 bg-gray-800/50 rounded">TypeScript</span>
                <span className="px-2 py-1 bg-gray-800/50 rounded">Prisma ORM</span>
                <span className="px-2 py-1 bg-gray-800/50 rounded">Supabase Auth</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-12 sm:mt-16"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {/* Stat 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.3 }}
              className="text-center p-4 sm:p-6 bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-xl border border-gray-700/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp size={18} className="text-green-400" />
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">100%</div>
              </div>
              <div className="text-white text-sm sm:text-base">Free & Open</div>
              <div className="text-gray-400 text-xs mt-1">No hidden costs</div>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4 }}
              className="text-center p-4 sm:p-6 bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-xl border border-gray-700/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap size={18} className="text-green-400" />
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">Instant</div>
              </div>
              <div className="text-white text-sm sm:text-base">Quick Setup</div>
              <div className="text-gray-400 text-xs mt-1">Start in seconds</div>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5 }}
              className="text-center p-4 sm:p-6 bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-xl border border-gray-700/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield size={18} className="text-green-400" />
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">Secure</div>
              </div>
              <div className="text-white text-sm sm:text-base">Production Ready</div>
              <div className="text-gray-400 text-xs mt-1">Enterprise-grade</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Bento;
