import React, { useState, useRef, useEffect } from 'react';
import GroupExpense from '../components/GroupExpense';
import FriendExpense from '../components/FriendExpense';
import RealTimeExpenseBox from '../components/RealTimeExpenseBox';
import { 
  Users, User, ArrowLeft, IndianRupee, PieChart, ArrowUpRight, ArrowDownLeft, Zap,
  TrendingUp, TrendingDown, CircleDollarSign, Wallet, CreditCard, Sparkles,
  ArrowRight, Shield, Crown, Calendar, Send, Receipt, DollarSign, 
  Plus, Minus, Divide, Percent, Calculator, Banknote, Coins, PiggyBank,
  TrendingUp as ChartUp, TrendingDown as ChartDown, BarChart3, LineChart,
  Target, Goal, WalletCards, ReceiptText, FileText, ClipboardList,
  Smartphone, Laptop, Monitor, Server, Database, Cloud, Wifi, Bluetooth,
  Clock, CheckCircle2, Loader2, AlertCircle, X, PartyPopper, Confetti, 
  ThumbsUp, Rocket, Fire, Star, Target as TargetIcon, Trophy, Medal,
  Gift, Heart, Bell, Megaphone, Sparkles as SparklesIcon, Zap as ZapIcon
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGroupDetails, useGroupBalance } from '../hooks/useGroup';
import { useAuth } from '../context/AuthContext';
import { useCreateSettlement } from '../hooks/useCreateSettlement';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';



const PremiumBackground = () => {
  const icons = [
    { Icon: DollarSign, color: 'bg-green-400/20' },
    { Icon: IndianRupee, color: 'bg-emerald-400/20' },
    { Icon: Wallet, color: 'bg-blue-400/20' },
    { Icon: CreditCard, color: 'bg-purple-400/20' },
    { Icon: Coins, color: 'bg-yellow-400/20' },
    { Icon: PiggyBank, color: 'bg-pink-400/20' },
    { Icon: Banknote, color: 'bg-green-400/20' },
    { Icon: Calculator, color: 'bg-gray-400/20' },
    { Icon: PieChart, color: 'bg-indigo-400/20' },
    { Icon: BarChart3, color: 'bg-blue-400/20' },
    { Icon: LineChart, color: 'bg-teal-400/20' },
    { Icon: ChartUp, color: 'bg-green-400/20' },
    { Icon: ChartDown, color: 'bg-red-400/20' },
    { Icon: Target, color: 'bg-orange-400/20' },
    { Icon: Goal, color: 'bg-purple-400/20' },
    { Icon: WalletCards, color: 'bg-cyan-400/20' },
    { Icon: ReceiptText, color: 'bg-emerald-400/20' },
    { Icon: FileText, color: 'bg-gray-400/20' },
    { Icon: ClipboardList, color: 'bg-blue-400/20' },
    { Icon: Smartphone, color: 'bg-indigo-400/20' },
    { Icon: Laptop, color: 'bg-purple-400/20' },
    { Icon: Monitor, color: 'bg-teal-400/20' },
    { Icon: Cloud, color: 'bg-blue-400/20' },
    { Icon: Wifi, color: 'bg-green-400/20' },
    { Icon: Bluetooth, color: 'bg-indigo-400/20' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Animated Icons */}
      {icons.map(({ Icon, color }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color} rounded-lg p-1.5`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [0.8, 1, 0.8],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        >
          <Icon size={14} className="text-white/60" />
        </motion.div>
      ))}
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, 5, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const MoneyFlowIndicator = ({ amount, isProcessing = false }: { amount: number, isProcessing?: boolean }) => (
  <motion.div
    className="flex items-center justify-center"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="relative">
      <motion.div
        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-lg"
        animate={{
          boxShadow: isProcessing 
            ? '0 0 8px rgba(245, 158, 11, 0.5)'
            : [
                '0 0 0px rgba(245, 158, 11, 0.3)',
                '0 0 8px rgba(245, 158, 11, 0.5)',
                '0 0 0px rgba(245, 158, 11, 0.3)'
              ],
          scale: isProcessing ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: isProcessing ? 0.8 : 2, repeat: Infinity }}
      >
        <span className="text-white font-bold text-xs sm:text-sm flex items-center gap-1">
          <motion.div
            animate={isProcessing ? { rotate: 360 } : {}}
            transition={isProcessing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            <IndianRupee size={12} className="text-amber-100" />
          </motion.div>
          {amount.toFixed(2)}
        </span>
      </motion.div>
      
      {/* Floating coins effect */}
      {!isProcessing && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            y: [0, -3, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <Coins size={10} className="text-yellow-300" />
        </motion.div>
      )}
    </div>
  </motion.div>
);

const UserAvatar = ({ 
  name, 
  isCurrentUser = false,
  size = "md",
  isProcessing = false
}: { 
  name: string; 
  isCurrentUser?: boolean;
  size?: "sm" | "md" | "lg";
  isProcessing?: boolean;
}) => {
  const sizeClasses = {
    sm: "w-5 h-5 text-[8px]",
    md: "w-6 h-6 text-[10px] sm:w-8 sm:h-8 sm:text-xs",
    lg: "w-8 h-8 text-xs sm:w-10 sm:h-10 sm:text-sm"
  };

  const initial = name?.charAt(0)?.toUpperCase() || 'U';
  
  return (
    <motion.div
      className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center font-bold 
        border-2 shadow-lg relative overflow-hidden
        ${isCurrentUser 
          ? 'bg-gradient-to-br from-green-400 to-emerald-600 border-green-300 text-white' 
          : 'bg-gradient-to-br from-blue-400 to-cyan-600 border-blue-300 text-white'
        }
      `}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      animate={
        isProcessing ? {
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        } : {}
      }
      transition={isProcessing ? { duration: 1, repeat: Infinity } : {}}
    >
      {initial}
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
      
      {/* Online/Processing Indicator */}
      {isProcessing && (
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full border border-gray-900"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

const SettlementCard = ({ 
  settlement, 
  index,
  currentUserId,
  groupMembers,
  groupId,
  onSettlementComplete
}: { 
  settlement: any;
  index: number;
  currentUserId: string;
  groupMembers: any[];
  groupId: string;
  onSettlementComplete: (settlementId: string, amount: number) => void;
}) => {
  const { mutateAsync: createSettlement } = useCreateSettlement();
  const [localLoading, setLocalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  
  const findUserName = (userId: string) => {
    const member = groupMembers.find(m => m.userId === userId);
    return member?.user?.name || 'Unknown User';
  };

  const fromUserName = findUserName(settlement.from);
  const toUserName = findUserName(settlement.to);
  const isFromCurrentUser = settlement.from === currentUserId;
  const isToCurrentUser = settlement.to === currentUserId;

  const handleSettle = async () => {
    if (!isFromCurrentUser) return;

    setLocalLoading(true);

    const loadingToast = toast.custom((t) => (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-r from-gray-800 to-gray-900 border border-emerald-500/30 rounded-xl p-4 shadow-lg w-full max-w-md"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
          >
            <Zap size={20} className="text-white" />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm">Processing Settlement</h3>
            <p className="text-emerald-200 text-xs mt-1">
              Sending ₹{settlement.amount} to <span className="font-semibold">{toUserName}</span>
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </div>
              <span className="text-emerald-400 text-xs font-medium">Processing...</span>
            </div>
          </div>
        </div>
      </motion.div>
    ), {
      duration: 3000,
      position: 'top-center',
    });

    try {
      await createSettlement({
        groupId,
        receiverId: settlement.to,
        amount: settlement.amount
      });

      setShowSuccess(true);
      
      setTimeout(() => {
        toast.success(
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center"
            >
              <CheckCircle2 size={20} className="text-white" />
            </motion.div>
            <div>
              <h4 className="font-bold text-white text-sm">Settlement Successful!</h4>
              <p className="text-emerald-200 text-xs">₹{settlement.amount} sent to {toUserName}</p>
            </div>
          </div>,
          { 
            duration: 4000,
            position: 'top-center',
            style: {
              background: 'linear-gradient(135deg, #059669, #047857)',
              border: '1px solid #10b981',
              borderRadius: '12px',
            }
          }
        );

        if (cardRef.current) {
          triggerConfetti(cardRef.current);
        }

        setTimeout(() => {
          onSettlementComplete(settlement.id, settlement.amount);
        }, 500);

      }, 100);

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to process settlement';
      
      toast.error(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center">
            <AlertCircle size={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Payment Failed</h4>
            <p className="text-red-200 text-xs">{errorMessage}</p>
          </div>
        </div>,
        { 
          duration: 5000,
          position: 'top-center'
        }
      );
      
      setLocalLoading(false);
    }
  };

  const triggerConfetti = (element: HTMLElement) => {
    const confettiCount = 15;
    const colors = ['#10b981', '#34d399', '#fbbf24', '#f59e0b'];
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'absolute w-2 h-2 rounded-full z-50';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = '50%';
      
      element.appendChild(confetti);
      
      const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(-${80 + Math.random() * 80}px) translateX(${Math.random() * 60 - 30}px) rotate(${360 * (Math.random() > 0.5 ? 1 : -1)}deg)`, opacity: 0 }
      ], {
        duration: 800 + Math.random() * 400,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
      });
      
      animation.onfinish = () => confetti.remove();
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ 
        opacity: showSuccess ? 0 : 1,
        y: showSuccess ? -15 : 0,
        scale: showSuccess ? 0.9 : 1,
        transition: { 
          duration: showSuccess ? 0.3 : 0.5,
          type: "spring",
          stiffness: 100
        }
      }}
      whileHover={{ 
        y: -2,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-white/10 p-3 sm:p-4 relative overflow-hidden group cursor-pointer shadow-xl mb-3"
    >
      {/* Success Overlay */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/10 z-10 flex items-center justify-center rounded-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <p className="text-white font-bold text-sm">Settled!</p>
            <p className="text-emerald-200 text-xs mt-1">Payment Successful</p>
          </motion.div>
        </motion.div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-1 bg-emerald-500/20 rounded-lg border border-emerald-500/30"
            >
              <Receipt size={14} className="text-emerald-400" />
            </motion.div>
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wide">
              #{index + 1}
            </span>
          </div>
          
          {!localLoading && !showSuccess && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-1 bg-gray-700/80 rounded-lg border border-gray-600"
            >
              <Calendar size={12} className="text-gray-400" />
            </motion.div>
          )}
        </div>

        {/* Users and Arrow Section */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
          {/* From User */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <UserAvatar 
              name={fromUserName} 
              isCurrentUser={isFromCurrentUser}
              size="sm"
              isProcessing={localLoading && isFromCurrentUser}
            />
            <div className="flex-1 min-w-0">
              <p className={`text-xs sm:text-sm font-semibold truncate ${
                isFromCurrentUser ? 'text-green-300' : 'text-blue-300'
              }`}>
                {isFromCurrentUser ? 'You' : fromUserName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <ArrowUpRight size={10} className="text-red-400" />
                <p className="text-red-400 text-[10px] sm:text-xs font-medium">Pays</p>
              </div>
            </div>
          </div>

          {/* Animated Arrow */}
          <motion.div
            className="flex items-center px-1 sm:px-2"
            animate={localLoading ? {
              x: [0, 4, 0, -4, 0],
            } : {
              x: [0, 3, 0],
            }}
            transition={localLoading ? {
              duration: 1,
              repeat: Infinity,
            } : {
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="relative">
              <ArrowRight size={16} className="text-purple-400" />
              {localLoading && (
                <motion.div
                  className="absolute -inset-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={18} className="text-yellow-400" />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* To User */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
            <div className="flex-1 min-w-0 text-right">
              <p className={`text-xs sm:text-sm font-semibold truncate ${
                isToCurrentUser ? 'text-green-300' : 'text-blue-300'
              }`}>
                {isToCurrentUser ? 'You' : toUserName}
              </p>
              <div className="flex items-center gap-1 mt-0.5 justify-end">
                <ArrowDownLeft size={10} className="text-green-400" />
                <p className="text-green-400 text-[10px] sm:text-xs font-medium">Receives</p>
              </div>
            </div>
            <UserAvatar 
              name={toUserName} 
              isCurrentUser={isToCurrentUser}
              size="sm"
              isProcessing={localLoading && isToCurrentUser}
            />
          </div>
        </div>

        {/* Amount Section */}
        <div className="mb-3 sm:mb-4">
          <MoneyFlowIndicator amount={settlement.amount} isProcessing={localLoading} />
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleSettle}
          disabled={!isFromCurrentUser || localLoading}
          whileHover={{ scale: isFromCurrentUser && !localLoading ? 1.03 : 1 }}
          whileTap={{ scale: isFromCurrentUser && !localLoading ? 0.97 : 1 }}
          className={`w-full py-2 sm:py-2.5 rounded-xl transition-all duration-300 group/btn relative overflow-hidden ${
            isFromCurrentUser 
              ? localLoading
                ? 'bg-gradient-to-r from-yellow-500/30 to-amber-600/30 border border-yellow-500/40 cursor-wait'
                : 'bg-gradient-to-r from-green-500/30 to-emerald-600/30 hover:from-green-500/40 hover:to-emerald-600/40 border border-green-500/40 cursor-pointer'
              : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-500/30 cursor-not-allowed'
          }`}
        >
          {/* Button Shine Effect */}
          {isFromCurrentUser && !localLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
          )}
          
          <span className={`text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-2 relative z-10 ${
            isFromCurrentUser ? 'text-green-300' : 'text-gray-400'
          }`}>
            {localLoading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Processing Payment...
              </>
            ) : isFromCurrentUser ? (
              <>
                <Send size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                Settle Now
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap size={10} className="text-yellow-400" />
                </motion.div>
              </>
            ) : (
              <>
                <Clock size={12} />
                Awaiting Payment
              </>
            )}
          </span>
        </motion.button>

        {/* Timestamp */}
        <div className="flex items-center justify-center gap-1 mt-2 pt-2 border-t border-gray-700/50">
          <Clock size={10} className="text-gray-500" />
          <span className="text-gray-500 text-[10px] sm:text-xs">
            Created just now
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const BalanceCard = ({ 
  title, 
  amount, 
  type = 'neutral',
  icon: Icon,
  description,
  isUpdating = false,
  pulse = false
}: {
  title: string;
  amount: number;
  type?: 'positive' | 'negative' | 'neutral';
  icon: any;
  description: string;
  isUpdating?: boolean;
  pulse?: boolean;
}) => {
  const colors = {
    positive: 'from-green-500/20 to-emerald-600/20 border-green-500/30 text-green-300',
    negative: 'from-red-500/20 to-orange-600/20 border-red-500/30 text-red-300',
    neutral: 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-300'
  };

  const icons = {
    positive: <TrendingUp size={14} className="text-green-400" />,
    negative: <TrendingDown size={14} className="text-red-400" />,
    neutral: <CircleDollarSign size={14} className="text-gray-400" />
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: pulse ? [1, 1.03, 1] : 1,
        opacity: 1,
        boxShadow: pulse 
          ? '0 0 20px rgba(16, 185, 129, 0.2)'
          : '0 8px 25px -5px rgba(0, 0, 0, 0.1)'
      }}
      transition={pulse ? { duration: 1, repeat: Infinity } : {}}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gradient-to-br ${colors[type]} rounded-xl border p-2 sm:p-3 backdrop-blur-sm relative overflow-hidden group`}
    >
      {/* Update Animation */}
      {isUpdating && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <motion.div
              className="p-1 bg-white/10 rounded-lg sm:p-1.5"
              animate={isUpdating ? { rotate: 360 } : {}}
              transition={isUpdating ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
            >
              <Icon size={12} className={type === 'positive' ? 'text-green-400' : type === 'negative' ? 'text-red-400' : 'text-gray-400'} />
            </motion.div>
            <span className="text-xs sm:text-sm font-semibold">{title}</span>
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: isUpdating ? [0, 180, 360] : [0, 0, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {icons[type]}
          </motion.div>
        </div>
        <div className="text-sm sm:text-lg font-bold flex items-center gap-1 mb-0.5 sm:mb-1">
          <IndianRupee size={12} />
          {Math.abs(amount).toFixed(2)}
          {isUpdating && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="ml-1"
            >
              <Loader2 size={10} className="text-green-400 animate-spin" />
            </motion.div>
          )}
        </div>
        <p className="text-[10px] sm:text-xs opacity-80">{description}</p>
      </div>
    </motion.div>
  );
};

const BalanceSummarySection = ({ 
  balanceData, 
  groupDetails, 
  user,
  isAdmin,
  groupId
}: { 
  balanceData: any;
  groupDetails: any;
  user: any;
  isAdmin: boolean;
  groupId: string;
}) => {
  const [pendingSettlements, setPendingSettlements] = useState<any[]>([]);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [isBalanceUpdating, setIsBalanceUpdating] = useState(false);
  const [pulseCard, setPulseCard] = useState<'owe' | 'get' | null>(null);

  // Initialize from balanceData
  React.useEffect(() => {
    if (balanceData) {
      const settlements = (balanceData.settlements || []).filter(
        (s: any) => s.amount > 0.01
      );
      setPendingSettlements(settlements);

      if (balanceData.balances && user?.id) {
        const userBalance = balanceData.balances.find((b: any) => b.userId === user.id);
        setCurrentBalance(userBalance?.balance || 0);
      }
    }
  }, [balanceData, user]);

  const youOweAmount = currentBalance < 0 ? Math.abs(currentBalance) : 0;
  const youGetAmount = currentBalance > 0 ? currentBalance : 0;

  const handleSettlementComplete = (settlementId: string, settlementAmount: number) => {
    const removedSettlement = pendingSettlements.find(s => s.id === settlementId);
    if (!removedSettlement) return;

    setPendingSettlements(prev => prev.filter(s => s.id !== settlementId));

    const isPaying = removedSettlement.from === user?.id;
    setPulseCard(isPaying ? 'owe' : 'get');

    setIsBalanceUpdating(true);

    setTimeout(() => {
      let newBalance = currentBalance;
      if (isPaying) {
        newBalance = currentBalance + settlementAmount;
      } else {
        newBalance = currentBalance - settlementAmount;
      }

      setCurrentBalance(newBalance);
      
      setTimeout(() => {
        setIsBalanceUpdating(false);
        setPulseCard(null);
      }, 1000);
    }, 500);
  };

  const showScroll = pendingSettlements.length > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[456px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700/50 p-4 flex flex-col overflow-hidden backdrop-blur-sm"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-3"
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
            <PieChart size={12} className="text-white" />
          </motion.div>
          <div>
            <h2 className="text-white font-semibold text-sm">Balance Summary</h2>
            <p className="text-emerald-400 text-xs">Live Updates</p>
          </div>
        </div>
        
        {/* Update Indicator */}
        {isBalanceUpdating && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/30"
          >
            <Loader2 size={10} className="text-emerald-400 animate-spin" />
            <span className="text-emerald-400 text-xs font-medium">Updating...</span>
          </motion.div>
        )}
      </motion.div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <BalanceCard
          title="You Owe"
          amount={youOweAmount}
          type={youOweAmount > 0 ? 'negative' : 'neutral'}
          icon={ArrowUpRight}
          description="Total to pay"
          isUpdating={isBalanceUpdating}
          pulse={pulseCard === 'owe'}
        />
        <BalanceCard
          title="You Get"
          amount={youGetAmount}
          type={youGetAmount > 0 ? 'positive' : 'neutral'}
          icon={ArrowDownLeft}
          description="Total to receive"
          isUpdating={isBalanceUpdating}
          pulse={pulseCard === 'get'}
        />
      </div>

      {/* Settlements Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Receipt size={14} className="text-purple-400" />
            <h3 className="text-white font-medium text-xs">Pending Settlements</h3>
          </div>
          <span className="text-purple-400 text-xs font-medium bg-purple-500/20 px-2 py-1 rounded-full">
            {pendingSettlements.length} pending
          </span>
        </div>

        <div className={`flex-1 ${showScroll ? 'overflow-y-auto' : ''} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1`}>
          <AnimatePresence>
            {pendingSettlements.length > 0 ? (
              pendingSettlements.map((settlement: any, index: number) => (
                <SettlementCard 
                  key={settlement.id}
                  settlement={settlement}
                  index={index}
                  currentUserId={user?.id || ''}
                  groupMembers={groupDetails.members || []}
                  groupId={groupId}
                  onSettlementComplete={handleSettlementComplete}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-xl border border-green-500/30 h-full flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="p-2 bg-green-500/20 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2"
                >
                  <PartyPopper className="text-green-400" size={16} />
                </motion.div>
                <p className="text-green-400 text-xs font-semibold">All Settled!</p>
                <p className="text-gray-400 text-[10px] mt-1 px-4">No pending settlements to show</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
            style={{
              left: `${15 + i * 25}%`,
              top: `${25 + i * 15}%`,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};


const ExpensePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'group' | 'friend'>('group');
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();

  const { data: groupDetails, isLoading: groupLoading, error: groupError } = useGroupDetails(groupId || '');
  const { data: balanceData, isLoading: balanceLoading } = useGroupBalance(groupId || '');

  const isAdmin = groupDetails?.creatorId === user?.id;
  const availableFriends = groupDetails?.members?.filter((member: any) => 
    member.userId !== user?.id
  ) || [];
  const showFriendExpense = availableFriends.length > 0;

  if (groupLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 sm:w-12 sm:h-12 border-3 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"
          />
          <p className="text-white text-sm sm:text-base font-medium">Loading your expenses...</p>
          <p className="text-emerald-400 text-xs mt-2">Preparing experience</p>
        </motion.div>
      </div>
    );
  }

  if (groupError || !groupDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-red-500/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm max-w-xs w-full"
        >
          <Shield className="text-red-400 mx-auto mb-2" size={28} />
          <h2 className="text-red-400 text-base font-bold mb-2">Group Not Found</h2>
          <p className="text-gray-300 text-sm mb-4">We couldn't load this group.</p>
          <button
            onClick={() => navigate('/groups')}
            className="w-full px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 text-sm font-medium"
          >
            Back to Groups
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      <PremiumBackground />
      
      {/* Sticky Header */}
      <header className="bg-gray-800/90 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/groups')}
                className="p-2 bg-gray-700/80 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-600 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl sm:text-2xl font-bold text-white"
                >
                  Expense Management
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-emerald-400 text-sm flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {groupDetails.name}
                </motion.p>
              </div>
            </div>

            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center gap-2 text-yellow-400 bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-500/30"
              >
                <Crown className="w-5 h-5" />
                <span className="text-sm font-medium">Group Admin</span>
              </motion.div>
            )}
          </div>

          {/* Tab Switch */}
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex bg-gray-700/80 backdrop-blur-sm rounded-lg p-1 border border-gray-600 mt-4 max-w-md mx-auto"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('group')}
              className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
                activeTab === 'group' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Group</span>
            </motion.button>
            
            {showFriendExpense && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('friend')}
                className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
                  activeTab === 'friend' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Friend</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pb-8 pt-5 sm:pt-6">
        {activeTab === 'group' && (
          <div className="px-4 sm:px-6">
            <div className="flex flex-col xl:flex-row gap-8 lg:gap-10 xl:gap-12 mb-8 lg:mb-10 items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full xl:w-[420px] h-[484px] flex-shrink-0 mb-8 lg:mb-10 xl:mb-0"
              >
                <RealTimeExpenseBox 
                  groupId={groupId || ''}
                  currentUser={user}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full xl:w-[420px] h-[460px] flex-shrink-0"
              >
                <BalanceSummarySection 
                  balanceData={balanceData}
                  groupDetails={groupDetails}
                  user={user}
                  isAdmin={isAdmin}
                  groupId={groupId || ''}
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 lg:mt-10"
            >
              <GroupExpense 
                groupId={groupId || ''} 
                groupMembers={groupDetails.members || []} 
                currentUser={user}
              />
            </motion.div>
          </div>
        )}

        {activeTab === 'friend' && (
          <div className="px-4 sm:px-6">
            <FriendExpense 
              groupId={groupId || ''}
              groupMembers={availableFriends}
              isAdmin={isAdmin}
              currentUser={user}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default ExpensePage;
