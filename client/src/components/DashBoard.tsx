import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CreditCard, Wallet, FileText, 
  Sparkles, TrendingUp, Shield, Rocket, 
  ArrowRight, Eye, LayoutDashboard, Plus
} from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading } = useDashboardStats();
  const [hasGroups, setHasGroups] = useState(false);

  // Check if user has groups
  useEffect(() => {
    if (stats?.totalGroups && stats.totalGroups > 0) {
      setHasGroups(true);
    } else {
      setHasGroups(false);
    }
  }, [stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    }
  };

  const cardVariants = {
    hidden: { 
      scale: 0.9, 
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.03,
      y: -8,
      boxShadow: "0 20px 40px -12px rgba(16, 185, 129, 0.25)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.4)",
      transition: {
        type: "spring",
        stiffness: 400
      }
    },
    tap: { 
      scale: 0.95,
      boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.3)"
    }
  };

  const iconHoverVariants = {
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: {
        type: "spring",
        stiffness: 400
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [0, -15, 0],
      rotate: [0, 2, -1, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

 
  const features = [
    { 
      label: "Create Groups", 
      description: "Start managing expenses with friends & family",
      icon: Users,
      status: "active",
      comingSoon: false,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20"
    },
    { 
      label: "Add Expenses", 
      description: "Track shared expenses in real-time",
      icon: CreditCard,
      status: "active", 
      comingSoon: false,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    { 
      label: "Settlements", 
      description: "Track payments and clear dues",
      icon: Wallet,
      status: "active",
      comingSoon: false,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    { 
      label: "Expense Analytics", 
      description: "Visual insights into your spending patterns",
      icon: TrendingUp,
      status: "coming",
      comingSoon: true,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20"
    },
    { 
      label: "Expense Reports", 
      description: "Generate detailed expense reports",
      icon: FileText,
      status: "coming",
      comingSoon: true,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20"
    },
    { 
      label: "AI Expense Bot", 
      description: "Smart assistant for expense management",
      icon: Rocket,
      status: "coming",
      comingSoon: true,
      color: "text-pink-400",
      bgColor: "bg-pink-500/20"
    }
  ];


  const statsConfig = [
    { 
      label: "Your Groups", 
      value: stats?.totalGroups?.toString() || "0", 
      icon: Users,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      delay: 0.1
    },
    { 
      label: "Active Expenses", 
      value: stats?.totalExpenses?.toString() || "0", 
      icon: Wallet,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      delay: 0.2
    },
    { 
      label: "Pending Settlements", 
      value: stats?.pendingSettlements?.toString() || "0", 
      icon: CreditCard,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      delay: 0.3
    }
  ];

 
  const handleGroupsClick = () => {
    navigate('/groups');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-emerald-200">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative overflow-hidden"
    >
     
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Icons - Original Colors */}
        {[
          { icon: Users, size: 24, left: '5%', top: '10%', delay: 0 },
          { icon: CreditCard, size: 28, left: '90%', top: '20%', delay: 0.5 },
          { icon: Wallet, size: 26, left: '8%', top: '80%', delay: 1 },
          { icon: FileText, size: 30, left: '85%', top: '65%', delay: 1.5 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute hidden sm:block text-emerald-600/20" 
            style={{
              left: item.left,
              top: item.top,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 8, -4, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut"
            }}
          >
            <item.icon size={item.size} />
          </motion.div>
        ))}

      
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.15, 0.08], 
            x: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-900/20 to-teal-900/15 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.1, 0.05, 0.1], 
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-900/15 to-cyan-900/10 rounded-full blur-3xl"
        />

        
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute hidden sm:block w-1.5 h-1.5 bg-emerald-600/15 rounded-full" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

    
      <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/70 rounded-2xl sm:rounded-3xl border border-gray-600/30 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -skew-x-12 -translate-x-full"
            whileHover={{ translateX: "200%" }}
            transition={{ duration: 1.2 }}
          />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 gap-4">
            <div className="flex-1">
              <motion.h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2 sm:mb-3"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {hasGroups ? `Welcome back, ${user?.user_metadata?.name || user?.email}!` : 'Welcome to ExpenseSync!'}
              </motion.h1>
              <motion.p 
                className="text-emerald-200/80 text-base sm:text-lg lg:text-xl"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {hasGroups 
                  ? `Managing ${stats?.totalGroups || 0} groups with ExpenseSync` 
                  : 'Split bills like a pro with ExpenseSync'
                }
              </motion.p>
            </div>
            <motion.div
              variants={floatingVariants}
              animate="float"
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-800/40 to-teal-800/40 px-4 py-2 rounded-xl border border-emerald-500/30 backdrop-blur-sm"
            >
              <span className="text-emerald-300 font-medium text-sm sm:text-base">
                {hasGroups ? 'Active User' : 'Get Started'}
              </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

    
      <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {statsConfig.map((stat, index) => (
            <motion.div
              key={index}
              variants={statsVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
              transition={{ delay: stat.delay }}
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/70 rounded-xl sm:rounded-2xl border border-gray-600/30 p-4 sm:p-6 hover:border-emerald-400/40 transition-all duration-300 backdrop-blur-xl relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/3 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <motion.h3 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2"
                    whileHover={{ scale: 1.03 }}
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-gray-300 font-medium text-sm sm:text-base">{stat.label}</p>
                </div>
                <motion.div
                  variants={iconHoverVariants}
                  whileHover="hover"
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${stat.bgColor} backdrop-blur-sm border border-gray-600/30`}
                >
                  <stat.icon size={20} className={`${stat.color} sm:w-6 sm:h-6`} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    
      <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-gradient-to-r from-emerald-600/20 via-teal-600/15 to-cyan-600/10 rounded-2xl sm:rounded-3xl border border-emerald-500/20 p-6 sm:p-8 lg:p-10 text-center backdrop-blur-xl relative overflow-hidden group"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/8 to-teal-500/8 rounded-2xl sm:rounded-3xl"
          />
          
          <motion.div
            variants={floatingVariants}
            animate="float"
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl sm:shadow-2xl shadow-emerald-500/20 relative z-10 group-hover:shadow-emerald-500/30 transition-shadow duration-300"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              {hasGroups ? (
                <LayoutDashboard size={24} className="sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
              ) : (
                <Users size={24} className="sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
              )}
            </motion.div>
          </motion.div>
          
          <motion.h3 
            className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-3 sm:mb-4 relative z-10"
            whileHover={{ scale: 1.01 }}
          >
            {hasGroups ? 'Manage Your Groups' : 'Ready to get started?'}
          </motion.h3>
          
          <motion.p 
            className="text-emerald-200/80 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-md mx-auto relative z-10"
            whileHover={{ x: 2 }}
          >
            {hasGroups 
              ? `You have ${stats?.totalGroups} active group(s). View and manage all your expense groups.`
              : 'Create your first group and start splitting expenses with friends, roommates, or family members.'
            }
          </motion.p>
          
          <div className="relative z-10">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleGroupsClick}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 sm:px-14 lg:px-20 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl lg:text-2xl shadow-2xl sm:shadow-3xl shadow-emerald-500/30 relative overflow-hidden group/btn"
            >
              <span className="flex items-center gap-3 relative z-10">
                {hasGroups ? (
                  
                  <>
                    <Eye size={24} className="sm:w-7 sm:h-7" />
                    See Your Groups
                    <ArrowRight size={22} className="sm:w-6 sm:h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </>
                ) : (
                  
                  <>
                    <Plus size={24} className="sm:w-7 sm:h-7" />
                    Create First Group
                    <ArrowRight size={22} className="sm:w-6 sm:h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

     
      <motion.div variants={itemVariants}>
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 justify-center"
          whileHover={{ x: 3 }}
        >
          <motion.div
            animate={{ rotate: [0, 12, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles size={20} className="sm:w-7 sm:h-7 text-emerald-400" />
          </motion.div>
          <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
            ExpenseSync Features
          </span>
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/70 rounded-xl sm:rounded-2xl border border-gray-600/30 p-4 sm:p-6 hover:border-emerald-400/40 transition-all duration-300 backdrop-blur-xl relative overflow-hidden group"
            >
              {/* Coming Soon Badge */}
              {feature.comingSoon && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-300 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-amber-500/40 backdrop-blur-sm"
                >
                  Coming Soon
                </motion.div>
              )}
              
              {/* Icon */}
              <motion.div
                variants={iconHoverVariants}
                whileHover="hover"
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 sm:mb-6 backdrop-blur-sm border border-gray-600/30 ${feature.bgColor}`}
              >
                <feature.icon size={20} className={`${feature.color} sm:w-6 sm:h-6`} />
              </motion.div>
              
              {/* Title */}
              <motion.h3 
                className={`font-bold text-lg sm:text-xl mb-2 sm:mb-3 ${
                  feature.status === 'active' 
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                {feature.label}
              </motion.h3>
              
              {/* Description */}
              <motion.p 
                className="text-gray-300 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4"
                whileHover={{ x: 1 }}
              >
                {feature.description}
              </motion.p>
              
              {/* Active Indicator */}
              {feature.status === 'active' && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: index * 0.2 + 1, duration: 0.8 }}
                  className="h-0.5 sm:h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-3 sm:mt-4"
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

     
      <motion.div variants={itemVariants} className="mt-8 sm:mt-12 lg:mt-16 text-center">
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/50 rounded-xl sm:rounded-2xl border border-gray-600/20 p-4 sm:p-6 backdrop-blur-xl"
        >
          <div className="text-emerald-300/80 text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 flex-wrap">
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Shield size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-400" />
            </motion.div>
            {hasGroups 
              ? `Managing ${stats?.totalGroups} groups • ${stats?.totalExpenses} expenses • ${stats?.pendingSettlements} settlements`
              : 'Powered by Supabase • Enterprise Grade • Always Secure'
            }
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
