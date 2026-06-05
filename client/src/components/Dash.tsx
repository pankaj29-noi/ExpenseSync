import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Receipt, 
  PieChart, 
  Wallet, 
  ArrowLeftRight, 
  CheckCircle, 
  Smartphone,
  Zap
} from 'lucide-react';

const Dash: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Create Groups",
      description: "Create expense groups with friends, roommates, or colleagues",
      color: "from-green-400 to-emerald-500",
      delay: 0.1
    },
    {
      icon: Receipt,
      title: "Add Expenses",
      description: "Quickly add expenses and split them equally or custom amounts",
      color: "from-blue-400 to-cyan-500",
      delay: 0.2
    },
    {
      icon: ArrowLeftRight,
      title: "Track Balances",
      description: "See who owes whom and track all pending settlements",
      color: "from-purple-400 to-pink-500",
      delay: 0.3
    },
    {
      icon: PieChart,
      title: "Analytics",
      description: "Get insights into your spending patterns with beautiful charts",
      color: "from-orange-400 to-red-500",
      delay: 0.4
    },
    {
      icon: CheckCircle,
      title: "Settle Up",
      description: "Mark expenses as paid and keep everything organized",
      color: "from-yellow-400 to-amber-500",
      delay: 0.5
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Access your expenses anywhere with our mobile-responsive design",
      color: "from-indigo-400 to-purple-500",
      delay: 0.6
    }
  ];

  const stats = [
    { value: "5s", label: "Add Expense" },
    { value: "1min", label: "Create Group" },
    { value: "Real-time", label: "Sync" },
    { value: "24/7", label: "Access" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants  = {
    hidden: { y: 50, opacity: 0 },
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

  const cardVariants  = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (delay: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }),
    hover: {
      scale: 1.05,
      y: -10,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-950 to-emerald-950 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-gray-800/50 border border-green-500/20 rounded-full px-4 py-2 mb-4">
            <Zap size={16} className="text-green-400" />
            <span className="text-green-400 text-sm font-medium">How It Works</span>
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Simple
            </span>
            <span className="text-white"> & </span>
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Powerful
            </span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            ExpenseSync makes splitting expenses with friends and groups incredibly easy. 
            Here's how you can manage shared expenses in just a few clicks.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
                className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-1"
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={feature.delay}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="group relative p-6 bg-gray-800/20 rounded-2xl border border-gray-700/30 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.2, rotate: 360 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay + 0.2, type: "spring", stiffness: 200 }}
                className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 relative z-10`}
              >
                <feature.icon size={24} className="text-gray-950" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Dash;
