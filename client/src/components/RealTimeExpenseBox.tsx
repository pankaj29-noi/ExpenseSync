import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, User, Clock, Activity, Users } from 'lucide-react';
import { useGroupExpenses } from '../hooks/useExpense';
import { useGroupDetails } from '../hooks/useGroup';

// Simple Real-time Sync Icon
const RealTimeSyncSVG = () => (
  <motion.svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    className="w-6 h-6"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6 }}
  >
    {/* Simple circle with pulse */}
    <motion.circle
      cx="25"
      cy="25"
      r="12"
      fill="none"
      stroke="#10B981"
      strokeWidth="2"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    
    {/* Simple center dot */}
    <circle cx="25" cy="25" r="3" fill="#10B981" />
    
    {/* Simple signal dots */}
    <motion.circle
      cx="35"
      cy="25"
      r="1.5"
      fill="#10B981"
      animate={{
        opacity: [0, 1, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay: 0
      }}
    />
    
    <motion.circle
      cx="25"
      cy="35"
      r="1.5"
      fill="#10B981"
      animate={{
        opacity: [0, 1, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay: 0.5
      }}
    />
  </motion.svg>
);

const SplitBetweenSVG = ({ members }: { members: any[] }) => {
  const totalMembers = members.length;
  
  return (
    <motion.svg
      width="140"
      height="50"
      viewBox="0 0 140 50"
      className="w-full h-12"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main connecting line */}
      <motion.path
        d="M15 25 L125 25"
        stroke="#10B981"
        strokeWidth="2.5"
        strokeDasharray="5,5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      
      {/* Dynamic circles based on ALL members */}
      {members.map((member, index) => {
        const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#84CC16', '#06B6D4', '#8B5CF6'];
        // Calculate positions dynamically based on total members
        const positions = members.map((_, i) => {
          if (totalMembers === 1) return 70;
          return 15 + (i * (110 / (totalMembers - 1)));
        });
        
        return (
          <motion.g key={member.userId || member.id}>
            <motion.circle
              cx={positions[index]}
              cy="25"
              r="6"
              fill={colors[index % colors.length]}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                delay: 0.3 + index * 0.1,
              }}
            />
            <motion.text
              x={positions[index]}
              y="25"
              textAnchor="middle"
              dy="0.3em"
              className="text-[6px] font-bold fill-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              {member.user?.name?.charAt(0)?.toUpperCase() || 
               member.name?.charAt(0)?.toUpperCase() || 'U'}
            </motion.text>
          </motion.g>
        );
      })}
    </motion.svg>
  );
};

// Check if expense is a settlement
const isSettlementExpense = (expense: any) => {
  return expense.description?.toLowerCase().includes('settlement') || 
         expense.description?.toLowerCase().includes('settle') ||
         expense.category === 'SETTLEMENT';
};

// Time ago function
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} day ago`;
  return `${Math.floor(diffInSeconds / 2592000)} month ago`;
};

// PURANA WALA SCROLLING EFFECT with NAYA SIZE
const ScrollingExpensesList = ({ expenses, currentUser }: { expenses: any[], currentUser: any }) => {
  const [isPaused, setIsPaused] = useState(false);
  
  // Filter out settlement expenses - ONLY show regular expenses
  const regularExpenses = expenses.filter(expense => !isSettlementExpense(expense));
  
  // Duplicate regular expenses for seamless looping
  const duplicatedExpenses = regularExpenses.length > 0 ? [...regularExpenses, ...regularExpenses] : [];
  
  return (
    <div 
      className="relative h-44 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        className="space-y-3"
        animate={{ 
          y: regularExpenses.length > 0 ? [0, -60 * regularExpenses.length] : 0
        }}
        transition={{
          duration: regularExpenses.length > 0 ? regularExpenses.length * 6 : 0,
          repeat: regularExpenses.length > 0 ? Infinity : 0,
          ease: "linear",
        }}
        style={{ 
          animationPlayState: isPaused ? 'paused' : 'running' 
        }}
      >
        {duplicatedExpenses.map((expense, index) => {
          const isCurrentUser = expense.payer?.id === currentUser?.id;
          
          return (
            <motion.div
              key={`${expense.id}-${index}`}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-600/30 hover:border-emerald-500/30 transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index % (regularExpenses.length || 1)) * 0.1 }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-2 h-2 bg-emerald-500 rounded-full"
                  />
                  <h4 className="text-white font-medium text-sm truncate group-hover:text-emerald-300 transition-colors">
                    {expense.description}
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <User size={12} />
                  <span className={`${isCurrentUser ? 'text-emerald-400 font-semibold' : 'text-gray-300'}`}>
                    {isCurrentUser ? 'You' : expense.payer?.name || 'Unknown'}
                  </span>
                  <span>•</span>
                  <Clock size={12} />
                  <span>{getTimeAgo(expense.createdAt)}</span>
                </div>
              </div>

              <motion.div
                className="flex items-center gap-1 bg-emerald-500/20 px-3 py-2 rounded-lg border border-emerald-500/30 min-w-[70px] justify-center group-hover:bg-emerald-500/30 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <IndianRupee size={12} className="text-emerald-400" />
                <span className="text-emerald-400 font-bold text-sm">
                  {parseFloat(expense.amount).toFixed(2)}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Gradient fade effects for seamless loop */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
    </div>
  );
};

interface RealTimeExpenseBoxProps {
  groupId: string;
  currentUser: any;
}

const RealTimeExpenseBox: React.FC<RealTimeExpenseBoxProps> = ({ 
  groupId, 
  currentUser 
}) => {
  const { data: expenses, isLoading: expensesLoading, error: expensesError } = useGroupExpenses(groupId);
  const { data: groupDetails, isLoading: groupLoading, error: groupError } = useGroupDetails(groupId);

  const isLoading = expensesLoading || groupLoading;
  const error = expensesError || groupError;

  // Filter out settlement expenses - ONLY show regular expenses
  const regularExpenses = expenses?.filter(expense => !isSettlementExpense(expense)) || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-[480px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700/50 p-4 flex flex-col overflow-hidden">
        <div className="animate-pulse flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-400/30 rounded"></div>
              <div className="h-4 bg-gray-400/30 rounded w-24"></div>
            </div>
            <div className="w-6 h-6 bg-gray-400/30 rounded"></div>
          </div>
          
          {/* Recent Expenses */}
          <div className="flex-1 flex flex-col min-h-0 mb-3">
            <div className="h-3 bg-gray-400/30 rounded w-16 mb-3"></div>
            <div className="space-y-3 flex-1 overflow-hidden">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <div className="flex-1">
                    <div className="h-3 bg-gray-400/30 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-400/20 rounded w-1/2"></div>
                  </div>
                  <div className="h-7 bg-gray-400/30 rounded w-14"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Split Between */}
          <div className="mt-auto">
            <div className="h-3 bg-gray-400/30 rounded w-16 mb-2"></div>
            <div className="h-12 bg-gray-400/20 rounded mb-1"></div>
            <div className="flex justify-between">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-2 bg-gray-400/20 rounded w-8"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-[480px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-red-500/20 p-4 flex items-center justify-center">
        <div className="text-red-400 text-xs text-center">
          Failed to load real-time data
        </div>
      </div>
    );
  }

  const groupMembers = groupDetails?.members || [];

  if (regularExpenses.length === 0 && groupMembers.length === 0) {
    return (
      <div className="w-full h-[480px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700/50 p-4 flex flex-col items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-xs">No expenses yet</p>
          <p className="text-[10px] mt-1">Add expenses to see real-time updates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[480px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700/50 p-4 flex flex-col overflow-hidden backdrop-blur-sm">
      {/* Header with Real-time Sync */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-1 bg-emerald-500 rounded"
          >
            <Activity size={12} className="text-white" />
          </motion.div>
          <h2 className="text-white font-semibold text-sm">Live Group Activity</h2>
        </div>
        <RealTimeSyncSVG />
      </motion.div>

      {/* Recent Expenses Section - Purana effect with naya size */}
      <div className="flex-1 flex flex-col min-h-0 mb-4">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Recent Expenses
        </h3>
        
        {regularExpenses.length > 0 ? (
          <ScrollingExpensesList expenses={regularExpenses} currentUser={currentUser} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-2 bg-emerald-500/20 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2"
            >
              <Activity size={16} className="text-emerald-400" />
            </motion.div>
            <p className="text-xs">No expenses to show</p>
            <p className="text-[10px] mt-1">Add your first expense</p>
          </div>
        )}
      </div>

      {/* Split Between Section */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Split Between
          </h3>
          <div className="flex items-center gap-1">
            <Users size={12} className="text-emerald-400" />
            <span className="text-emerald-400 text-[10px] font-medium">
              {groupMembers.length} members
            </span>
          </div>
        </div>
        <SplitBetweenSVG members={groupMembers} />
        <div className="flex justify-between items-center mt-2 text-[10px] text-gray-400">
          {groupMembers.map((member, index) => (
            <motion.span
              key={member.userId || member.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="truncate max-w-[40px] text-center"
              title={member.user?.name || member.name || 'Unknown'}
            >
              {member.user?.name?.split(' ')[0] || member.name?.split(' ')[0] || 'Unknown'}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Floating particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RealTimeExpenseBox;





