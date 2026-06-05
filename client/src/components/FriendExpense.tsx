import React, { useState, useEffect } from 'react';
import { 
  User, Plus, IndianRupee, Calendar, Trash2, Edit, X, Users, Scale, 
  Wallet, PieChart, CreditCard, Zap, Sparkles, Clock, AlertCircle,
  Eye, EyeOff, Split, ChevronDown, CheckCircle, TrendingUp,
  Utensils, Plane, ShoppingBag, Film, Home, Heart, DollarSign,
  Loader2, CheckCircle2
} from 'lucide-react';
import { useCreateFriendExpense, useFriendExpenses, useDeleteExpense, useUpdateExpense } from '../hooks/useExpense';
import { ExpenseCategory } from '../api/expenseApi';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';

interface FriendExpenseProps {
  groupId: string;
  groupMembers: any[];
  isAdmin: boolean;
  currentUser: any;
}

const categoryIcons = {
  [ExpenseCategory.FOOD]: "Food",
  [ExpenseCategory.TRAVEL]: "Travel",
  [ExpenseCategory.SHOPPING]: "Shopping",
  [ExpenseCategory.ENTERTAINMENT]: "Entertainment",
  [ExpenseCategory.UTILITIES]: "Utilities",
  [ExpenseCategory.HEALTHCARE]: "Healthcare",
  [ExpenseCategory.OTHER]: "Other"
};

// const categoryIcons = {
//   [ExpenseCategory.FOOD]: <Utensils size={14} className="inline mr-1" />,
//   [ExpenseCategory.TRAVEL]: <Plane size={14} className="inline mr-1" />,
//   [ExpenseCategory.SHOPPING]: <ShoppingBag size={14} className="inline mr-1" />,
//   [ExpenseCategory.ENTERTAINMENT]: <Film size={14} className="inline mr-1" />,
//   [ExpenseCategory.UTILITIES]: <Home size={14} className="inline mr-1" />,
//   [ExpenseCategory.HEALTHCARE]: <Heart size={14} className="inline mr-1" />,
//   [ExpenseCategory.OTHER]: <DollarSign size={14} className="inline mr-1" />
// };


// const categoryIcons = {
//     [ExpenseCategory.FOOD]: Utensils,
//     [ExpenseCategory.TRAVEL]: Car,
//     [ExpenseCategory.SHOPPING]: ShoppingBag,
//     [ExpenseCategory.HOUSING]: Home,
//     [ExpenseCategory.ENTERTAINMENT]: GamepadIcon,
//     [ExpenseCategory.OTHER]: CreditCard,
//     SETTLEMENT: HandCoins
//   };

const SettlementNotification = () => (
  <motion.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
    className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-3 mb-4"
  >
    <div className="flex items-center gap-2">
      <motion.div
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Clock size={14} className="text-blue-400" />
      </motion.div>
      <div>
        <p className="text-blue-300 text-xs font-medium">
          Better settlement tracking coming soon
        </p>
      </div>
    </div>
  </motion.div>
);

const AnimatedBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Floating Icons */}
    {[User, Wallet, CreditCard, PieChart, Zap, Sparkles].map((Icon, index) => (
      <motion.div
        key={index}
        className="absolute text-emerald-400/20 hidden sm:block"
        style={{
          left: `${15 + index * 12}%`,
          top: `${20 + index * 8}%`,
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -3, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          delay: index * 0.5,
          ease: "easeInOut"
        }}
      >
        <Icon size={24} />
      </motion.div>
    ))}
    
    {/* Floating Particles */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-emerald-400/40 rounded-full hidden sm:block"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -25, 0],
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 1.5,
        }}
      />
    ))}
  </div>
);

const FriendExpense: React.FC<FriendExpenseProps> = ({ groupId, groupMembers, currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string>('');
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: ExpenseCategory.OTHER,
  });
  const [customSplits, setCustomSplits] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ amount?: string; splits?: string }>({});
  const [showSettlementNotification, setShowSettlementNotification] = useState(true);
  
  // Loading states
  const [isCreatingExpense, setIsCreatingExpense] = useState(false);
  const [isUpdatingExpense, setIsUpdatingExpense] = useState(false);

  const { user } = useAuth();
  const currentUserId = user?.id;

  const { data: friendExpenses, refetch: refetchFriendExpenses } = useFriendExpenses(selectedFriendId);
  const createFriendExpenseMutation = useCreateFriendExpense();
  const deleteExpenseMutation = useDeleteExpense();
  const updateExpenseMutation = useUpdateExpense();

  const availableFriends = groupMembers
    .filter(member => member.userId !== currentUserId)
    .map(member => ({
      id: member.userId,
      name: member.user?.name || 'Unknown',
      email: member.user?.email || ''
    }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const itemVariants = {
    hidden: { y: 8, opacity: 0 },
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

  const cardVariants = {
    hidden: { scale: 0.98, opacity: 0, y: 10 },
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
      scale: 1.01,
      y: -1,
      boxShadow: "0 8px 25px -8px rgba(16, 185, 129, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  useEffect(() => {
    if (availableFriends.length === 1 && !selectedFriendId) {
      setSelectedFriendId(availableFriends[0].id);
    }
  }, [availableFriends, selectedFriendId]);

  useEffect(() => {
    if (selectedFriendId) {
      if (editingExpense) {
        setFormData({
          description: editingExpense.description,
          amount: editingExpense.amount.toString(),
          category: editingExpense.category,
        });
        
        const yourSplit = editingExpense.splits?.find((split: any) => split.userId === currentUserId);
        const friendSplit = editingExpense.splits?.find((split: any) => split.userId === selectedFriendId);
        
        setCustomSplits({
          [currentUserId]: yourSplit?.amount?.toString() || '0',
          [selectedFriendId]: friendSplit?.amount?.toString() || '0'
        });
        
        const total = editingExpense.amount;
        const equalAmount = total / 2;
        const isEqualSplit = yourSplit?.amount === equalAmount && friendSplit?.amount === equalAmount;
        setSplitType(isEqualSplit ? 'equal' : 'custom');
      } else {
        const equalSplit = (parseFloat(formData.amount) || 0) / 2;
        setCustomSplits({
          [currentUserId]: equalSplit.toFixed(2),
          [selectedFriendId]: equalSplit.toFixed(2)
        });
      }
    }
  }, [selectedFriendId, formData.amount, currentUserId, editingExpense]);

  const validateAmount = (value: string): string | null => {
    const numValue = parseFloat(value);
    
    if (value === '' || isNaN(numValue)) {
      return 'Amount is required';
    }
    
    if (numValue <= 0) {
      return 'Amount must be greater than 0';
    }
    
    if (numValue < 1) {
      return 'Amount must be at least ₹1';
    }
    
    if (numValue > 1000000) {
      return 'Amount cannot exceed ₹10,00,000';
    }
    
    return null;
  };

  const validateCustomSplits = (): string | null => {
    if (splitType !== 'custom') return null;
    
    const totalAmount = parseFloat(formData.amount);
    const totalSplit = calculateTotalCustomSplit();
    
    const hasNegativeSplit = Object.values(customSplits).some(amount => {
      const numAmount = parseFloat(amount);
      return numAmount < 0;
    });
    
    if (hasNegativeSplit) {
      return 'Split amounts cannot be negative';
    }
    
    const hasInvalidSmallSplit = Object.values(customSplits).some(amount => {
      const numAmount = parseFloat(amount);
      return numAmount > 0 && numAmount < 1 && totalAmount >= 2;
    });
    
    if (hasInvalidSmallSplit) {
      return 'Split amounts must be at least ₹1';
    }
    
    if (Math.abs(totalSplit - totalAmount) > 0.01) {
      return 'Split amounts must match total amount';
    }
    
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const amountValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0).toString();
      setFormData(prev => ({ ...prev, [name]: amountValue }));
      setErrors(prev => ({ ...prev, amount: undefined }));
      
      if (splitType === 'equal' && selectedFriendId) {
        const amount = parseFloat(amountValue) || 0;
        const equalSplit = amount / 2;
        setCustomSplits({
          [currentUserId]: equalSplit.toFixed(2),
          [selectedFriendId]: equalSplit.toFixed(2)
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFriendSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFriendId(e.target.value);
    setEditingExpense(null);
  };

  const handleSplitTypeChange = (type: 'equal' | 'custom') => {
    setSplitType(type);
    if (type === 'equal' && selectedFriendId) {
      const amount = parseFloat(formData.amount) || 0;
      const equalSplit = amount / 2;
      setCustomSplits({
        [currentUserId]: equalSplit.toFixed(2),
        [selectedFriendId]: equalSplit.toFixed(2)
      });
      
      setErrors(prev => ({ ...prev, splits: undefined }));
    }
  };

  const handleCustomSplitChange = (userId: string, value: string) => {
    const splitValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0).toString();
    
    setCustomSplits(prev => ({
      ...prev,
      [userId]: splitValue
    }));
    
    setErrors(prev => ({ ...prev, splits: undefined }));
  };

  const calculateTotalCustomSplit = () => {
    return Object.values(customSplits).reduce((total, amount) => total + (parseFloat(amount) || 0), 0);
  };

  // Handle form submission with LOADER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFriendId) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-400" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Select Friend</h4>
            <p className="text-slate-300 text-xs">Please select a friend first</p>
          </div>
        </div>,
        { duration: 4000 }
      );
      return;
    }

    const amountError = validateAmount(formData.amount);
    if (amountError) {
      setErrors(prev => ({ ...prev, amount: amountError }));
      return;
    }

    const expenseAmount = parseFloat(formData.amount);
    
    const splitError = validateCustomSplits();
    if (splitError) {
      setErrors(prev => ({ ...prev, splits: splitError }));
      return;
    }
    
    let splits: { userId: string; amount: number }[] = [];
    
    if (splitType === 'equal') {
      const splitAmount = expenseAmount / 2;
      splits = [
        { userId: currentUserId!, amount: splitAmount },
        { userId: selectedFriendId, amount: splitAmount }
      ];
    } else {
      splits = Object.entries(customSplits).map(([userId, amount]) => ({
        userId,
        amount: parseFloat(amount) || 0
      }));
    }

    //  SHOW LOADER
    if (editingExpense) {
      setIsUpdatingExpense(true);
    } else {
      setIsCreatingExpense(true);
    }

    // Show loading toast
    const loadingToast = toast.loading(
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <div>
          <p className="font-medium text-white text-sm">
            {editingExpense ? 'Updating Private Expense...' : 'Creating Private Expense...'}
          </p>
          <p className="text-slate-300 text-xs">Please wait</p>
        </div>
      </div>,
      {
        duration: Infinity,
        position: 'top-center'
      }
    );

    try {
      if (editingExpense) {
        const expenseData = {
          description: formData.description,
          amount: expenseAmount,
          category: formData.category,
          splits: splits
        };

        await updateExpenseMutation.mutateAsync({
          expenseId: editingExpense.id,
          data: expenseData
        });
        
        // Success toast
        toast.dismiss(loadingToast);
        toast.success(
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-emerald-400" size={16} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Private Expense Updated!</h4>
              <p className="text-slate-300 text-xs">Expense updated successfully</p>
            </div>
          </div>,
          { duration: 4000 }
        );
        
        setShowForm(false);
        setEditingExpense(null);
        resetForm();
        refetchFriendExpenses();
      } else {
        const expenseData = {
          description: formData.description,
          amount: expenseAmount,
          friendId: selectedFriendId,
          category: formData.category,
          splits: splits
        };

        await createFriendExpenseMutation.mutateAsync(expenseData);
        
        // Success toast
        toast.dismiss(loadingToast);
        toast.success(
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-emerald-400" size={16} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Private Expense Created!</h4>
              <p className="text-slate-300 text-xs">Expense added successfully</p>
            </div>
          </div>,
          { duration: 4000 }
        );

        setShowForm(false);
        resetForm();
        refetchFriendExpenses();
      }
      
    } catch (error: any) {
      // Error toast
      toast.dismiss(loadingToast);
      
      const errorMessage = error.response?.data?.error || 'Failed to create expense';
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-400" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Creation Failed</h4>
            <p className="text-slate-300 text-xs">{errorMessage}</p>
          </div>
        </div>,
        { duration: 5000 }
      );
      
    } finally {
      // ENABLE BUTTON AFTER SUCCESS/ERROR
      setIsCreatingExpense(false);
      setIsUpdatingExpense(false);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setShowForm(true);
    setErrors({}); 
  };

  const handleDelete = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this private expense? This action cannot be undone.')) {
      deleteExpenseMutation.mutate(
        { expenseId, groupId },
        {
          onSuccess: () => {
            refetchFriendExpenses();
          }
        }
      );
    }
  };

  const handleSettleExpense = (expense: any) => {
    const youPaid = expense.payerId === currentUserId;
    const yourSplit = expense.splits?.find((split: any) => split.userId === currentUserId);
    const friendSplit = expense.splits?.find((split: any) => split.userId === selectedFriendId);
    
    const amount = youPaid ? friendSplit?.amount : yourSplit?.amount;
    const friendName = selectedFriend?.name;

    if (window.confirm(
      ` Mark this expense as settled?\n\n` +
      `This means ${youPaid ? `${friendName} has paid you ₹${amount}` : `you have paid ${friendName} ₹${amount}`}.\n\n` +
      `For now, the expense will be deleted. We're working on proper settlement tracking for the next update!\n\n` +
      `Click OK to confirm settlement.`
    )) {
      deleteExpenseMutation.mutate(
        { expenseId: expense.id, groupId },
        {
          onSuccess: () => {
            refetchFriendExpenses();
          }
        }
      );
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingExpense(null);
    setFormData({
      description: '',
      amount: '',
      category: ExpenseCategory.OTHER,
    });
    setSplitType('equal');
    setErrors({}); 
  };
  
  const selectedFriend = availableFriends.find(f => f.id === selectedFriendId);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-900 via-green-900 to-gray-900 p-3 sm:p-6 relative overflow-hidden">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          className: 'sonner-toast',
          success: {
            style: {
              background: '#064e3b',
              border: '1px solid #047857',
              color: '#ecfdf5',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#ecfdf5',
            },
          },
          error: {
            style: {
              background: '#7f1d1d',
              border: '1px solid #dc2626',
              color: '#fef2f2',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fef2f2',
            },
          },
          warning: {
            style: {
              background: '#78350f',
              border: '1px solid #d97706',
              color: '#fffbeb',
            },
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#fffbeb',
            },
          },
          loading: {
            style: {
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f1f5f9',
            },
          },
        }}
      />
      
      <AnimatedBackground />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header - Mobile Optimized */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6"
        >
          <motion.div variants={itemVariants} className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex-shrink-0"
              >
                <User className="text-white" size={16} />
              </motion.div>
              <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Friend Expenses</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-emerald-200/80 text-xs sm:text-sm">Private expenses between you and a friend</p>
              <motion.div
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30 flex-shrink-0"
              >
                <Eye size={10} className="text-blue-400" />
                <span className="text-blue-400 text-xs font-medium">Private</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            disabled={!selectedFriendId || isCreatingExpense || isUpdatingExpense}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center gap-2 hover:from-blue-600 hover:to-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/25 w-full sm:w-auto justify-center text-xs sm:text-base mt-2 sm:mt-0"
          >
            <Plus size={14} className="sm:size-4" />
            <span className="truncate">Add Private Expense</span>
          </motion.button>
        </motion.div>

        {/* Settlement Notification */}
        <AnimatePresence>
          {showSettlementNotification && selectedFriendId && (
            <SettlementNotification />
          )}
        </AnimatePresence>

        {/* Friend Selection Card */}
        <motion.div
          variants={cardVariants}
          className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-700/50 p-3 sm:p-6 mb-4 sm:mb-6 shadow-xl"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg flex-shrink-0"
            >
              <Users className="text-blue-400" size={14} />
            </motion.div>
            <h3 className="text-white font-semibold text-sm sm:text-lg">Select a Friend</h3>
          </div>
          
          {/* Friend Select Dropdown */}
          <div className="relative">
            <select
              value={selectedFriendId}
              onChange={handleFriendSelect}
              disabled={isCreatingExpense || isUpdatingExpense}
              className="w-full bg-gray-700/80 border border-gray-600/70 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 backdrop-blur-sm text-xs sm:text-base appearance-none cursor-pointer pr-8 sm:pr-10 hover:border-gray-500/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" className="bg-gray-800 text-gray-300 text-xs sm:text-sm py-2">
                <span className="flex items-center gap-2">
                  <User size={12} className="sm:size-4" />
                  Choose a friend to track private expenses with
                </span>
              </option>
              {availableFriends.map(friend => (
                <option 
                  key={friend.id} 
                  value={friend.id} 
                  className="bg-gray-800 text-white py-3 text-xs sm:text-sm border-b border-gray-700/50 last:border-b-0 hover:bg-blue-500/20 hover:text-blue-300 transition-colors duration-200"
                >
                  <span className="flex items-center gap-2">
                    <User size={12} className="text-blue-400 sm:size-4" />
                    {friend.name}
                    <span className="text-gray-400 text-xs ml-1">({friend.email})</span>
                  </span>
                </option>
              ))}
            </select>
            <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ChevronDown size={14} className="text-gray-400 sm:size-4" />
            </div>
          </div>

          {/* Selected Friend Info */}
          {selectedFriend && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-2 sm:p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={10} className="text-white sm:size-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-blue-400 font-medium text-xs sm:text-sm truncate">{selectedFriend.name}</p>
                  <p className="text-blue-400/70 text-xs truncate hidden sm:block">{selectedFriend.email}</p>
                </div>
                <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded border border-blue-500/30 flex-shrink-0">
                  <EyeOff size={8} className="text-blue-400 sm:size-3" />
                  <span className="text-blue-400 text-xs font-medium">Private</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Add/Edit Expense Form */}
        <AnimatePresence>
          {showForm && selectedFriendId && (
            <>
              {/* Backdrop for mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 sm:hidden"
                onClick={resetForm}
              />
              
              {/* Form Container */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="bg-gray-800/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6 mb-4 sm:mb-6 shadow-2xl fixed inset-2 sm:inset-auto sm:relative z-50 overflow-y-auto max-h-[90vh] sm:max-h-none"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-base sm:text-xl font-semibold truncate pr-2">
                    {editingExpense ? 'Edit Expense' : `Add with ${selectedFriend?.name}`}
                  </h3>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetForm}
                    disabled={isCreatingExpense || isUpdatingExpense}
                    className="text-gray-400 hover:text-white p-1 bg-gray-700/50 rounded-lg flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={16} className="sm:size-5" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Description */}
                  <div>
                    <label className="block text-emerald-200 text-xs sm:text-sm font-medium mb-2">
                      Description
                    </label>
                    <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm text-xs sm:text-base"
                        placeholder="Dinner, Movie, etc."
                        required
                        disabled={isCreatingExpense || isUpdatingExpense}
                      />
                    </motion.div>
                  </div>

                  {/* Amount and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div>
                      <label className="block text-emerald-200 text-xs sm:text-sm font-medium mb-2">
                        Total Amount (₹)
                      </label>
                      <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          className={`w-full bg-gray-700/50 border rounded-lg pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm text-xs sm:text-base ${
                            errors.amount 
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                              : 'border-gray-600/50 focus:border-blue-500 focus:ring-blue-500/20'
                          }`}
                          placeholder="0.00"
                          min="1"
                          step="0.01"
                          required
                          disabled={isCreatingExpense || isUpdatingExpense}
                        />
                      </motion.div>

                      {/* Amount Error Message */}
                      {errors.amount && (
                        <motion.div 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-red-400 text-xs mt-1"
                        >
                          <AlertCircle size={10} />
                          <span>{errors.amount}</span>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Category */}
                    <div>
                      <label className="block text-emerald-200 text-xs sm:text-sm font-medium mb-2">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700/80 border border-gray-600/70 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 backdrop-blur-sm text-xs sm:text-base appearance-none cursor-pointer pr-8 sm:pr-10 hover:border-gray-500/80 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isCreatingExpense || isUpdatingExpense}
                        >
                          {Object.values(ExpenseCategory).map(category => (
                            <option 
                              key={category} 
                              value={category} 
                              className="bg-gray-800 text-white py-3 text-xs sm:text-sm border-b border-gray-700/50 last:border-b-0 hover:bg-blue-500/20 hover:text-blue-300 transition-colors duration-200"
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-sm">{categoryIcons[category]}</span>
                                {category}
                              </span>
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <ChevronDown size={14} className="text-gray-400 sm:size-4" />
                        </div>
                      </div>
                      
                      {/* Category Preview */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-2 flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 sm:px-3 py-1 sm:py-2"
                      >
                        <span className="text-sm">{categoryIcons[formData.category]}</span>
                        <span className="font-medium truncate">{formData.category}</span>
                        <span className="text-emerald-400/70 hidden sm:inline">selected</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Split Type */}
                  <div>
                    <label className="block text-emerald-200 text-xs sm:text-sm font-medium mb-2">
                      Split Type
                    </label>
                    <div className="flex gap-2 sm:gap-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSplitTypeChange('equal')}
                        disabled={isCreatingExpense || isUpdatingExpense}
                        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg border transition-all duration-300 flex-1 justify-center text-xs sm:text-sm ${
                          splitType === 'equal' 
                            ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/25' 
                            : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Scale size={12} className="sm:size-4" />
                        <span>Equal</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSplitTypeChange('custom')}
                        disabled={isCreatingExpense || isUpdatingExpense}
                        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg border transition-all duration-300 flex-1 justify-center text-xs sm:text-sm ${
                          splitType === 'custom' 
                            ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/25' 
                            : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Split size={12} className="sm:size-4" />
                        <span>Custom</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Split Details */}
                  {formData.amount && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gray-700/30 rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-600/30"
                    >
                      <h4 className="text-emerald-200 text-sm sm:text-lg font-medium mb-3 flex items-center gap-2">
                        <Users size={14} className="sm:size-5" />
                        <span>Split Details</span>
                      </h4>
                      
                      {splitType === 'equal' ? (
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User size={8} className="text-white sm:size-3" />
                              </div>
                              <span className="text-gray-300 font-medium text-xs sm:text-sm">You pay:</span>
                            </div>
                            <span className="text-blue-400 font-bold text-sm sm:text-lg">
                              <IndianRupee size={10} className="inline mr-1 sm:size-4" />
                              {(parseFloat(formData.amount) / 2).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User size={8} className="text-white sm:size-3" />
                              </div>
                              <span className="text-gray-300 font-medium text-xs sm:text-sm">{selectedFriend?.name} pays:</span>
                            </div>
                            <span className="text-blue-400 font-bold text-sm sm:text-lg">
                              <IndianRupee size={10} className="inline mr-1 sm:size-4" />
                              {(parseFloat(formData.amount) / 2).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 sm:space-y-4">
                          {/* Your Share */}
                          <div>
                            <label className="block text-emerald-200 text-xs sm:text-sm mb-2 flex items-center gap-2">
                              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User size={6} className="text-white sm:size-3" />
                              </div>
                              <span>Your Share (₹)</span>
                            </label>
                            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                              <IndianRupee className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                              <input
                                type="number"
                                value={customSplits[currentUserId!] || ''}
                                onChange={(e) => handleCustomSplitChange(currentUserId!, e.target.value)}
                                className="w-full bg-gray-600/50 border border-gray-500/50 rounded-lg pl-7 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm text-xs sm:text-base"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                disabled={isCreatingExpense || isUpdatingExpense}
                              />
                            </motion.div>
                          </div>
                          
                          {/* Friend's Share */}
                          <div>
                            <label className="block text-emerald-200 text-xs sm:text-sm mb-2 flex items-center gap-2">
                              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <User size={6} className="text-white sm:size-3" />
                              </div>
                              <span className="truncate">{selectedFriend?.name}'s Share (₹)</span>
                            </label>
                            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                              <IndianRupee className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                              <input
                                type="number"
                                value={customSplits[selectedFriendId] || ''}
                                onChange={(e) => handleCustomSplitChange(selectedFriendId, e.target.value)}
                                className="w-full bg-gray-600/50 border border-gray-500/50 rounded-lg pl-7 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm text-xs sm:text-base"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                disabled={isCreatingExpense || isUpdatingExpense}
                              />
                            </motion.div>
                          </div>
                          
                          {/* Split Validation */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`rounded-lg p-2 sm:p-4 border ${
                              errors.splits 
                                ? 'bg-red-500/10 border-red-500/30' 
                                : 'bg-gray-600/30 border-gray-500/30'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="space-y-1 flex-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-300">Total Split:</span>
                                  <span className={`font-medium ${
                                    Math.abs(calculateTotalCustomSplit() - parseFloat(formData.amount)) > 0.01 
                                      ? 'text-red-400' 
                                      : 'text-emerald-400'
                                  }`}>
                                    ₹{calculateTotalCustomSplit().toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-300">Total Amount:</span>
                                  <span className="text-emerald-400 font-medium">
                                    ₹{parseFloat(formData.amount).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              {(errors.splits || Math.abs(calculateTotalCustomSplit() - parseFloat(formData.amount)) > 0.01) && (
                                <motion.div 
                                  initial={{ scale: 0.95 }}
                                  animate={{ scale: 1 }}
                                  className="flex items-center gap-1 text-red-400 text-xs font-medium mt-1 sm:mt-0 flex-shrink-0"
                                >
                                  <AlertCircle size={10} className="sm:size-3" />
                                  <span>{errors.splits || 'Amounts must match!'}</span>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Form */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={
                        !formData.description || 
                        !formData.amount || 
                        isCreatingExpense ||
                        isUpdatingExpense ||
                        errors.amount ||
                        errors.splits
                      }
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/25 text-xs sm:text-base flex items-center justify-center gap-2"
                    >
                      {isCreatingExpense || isUpdatingExpense ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {editingExpense ? 'Updating...' : 'Creating...'}
                        </>
                      ) : editingExpense ? 'Update' : 'Create Expense'}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetForm}
                      disabled={isCreatingExpense || isUpdatingExpense}
                      className="px-3 sm:px-6 bg-gray-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 text-xs sm:text-base flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Expenses List */}
        {selectedFriendId ? (
          friendExpenses && friendExpenses.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 sm:space-y-6"
            >
              <motion.div variants={itemVariants} className="flex items-center gap-2 sm:gap-3 text-white mb-3 sm:mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg flex-shrink-0"
                >
                  <User className="text-blue-400" size={14} />
                </motion.div>
                <h3 className="text-base sm:text-xl font-semibold truncate">Private with {selectedFriend?.name}</h3>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg text-xs sm:text-sm font-medium border border-blue-500/30 flex-shrink-0"
                >
                  {friendExpenses.length}
                </motion.span>
              </motion.div>
              
              {friendExpenses.map((expense) => {
                const youPaid = expense.payerId === currentUserId;
                const yourSplit = expense.splits?.find((split: any) => split.userId === currentUserId);
                const friendSplit = expense.splits?.find((split: any) => split.userId === selectedFriendId);
                const amount = youPaid ? friendSplit?.amount : yourSplit?.amount;
                
                return (
                  <motion.div
                    key={expense.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-700/50 p-3 sm:p-6 shadow-xl"
                  >
                    <div className="flex flex-col gap-3 sm:gap-6">
                      {/* Top Section */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base">{categoryIcons[expense.category]}</span>
                            <h3 className="text-white font-semibold text-sm sm:text-xl truncate">
                              {expense.description}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 border border-blue-500/30"
                            >
                              <IndianRupee size={10} />
                              {expense.amount}
                            </motion.span>
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg text-xs border border-emerald-500/30 flex items-center gap-1">
                              <span className="text-xs">{categoryIcons[expense.category]}</span>
                              <span className="truncate max-w-20 sm:max-w-none">{expense.category}</span>
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-300 flex-wrap">
                            <div className="flex items-center gap-1">
                              <User size={10} />
                              <span>{youPaid ? 'You paid' : `${selectedFriend?.name} paid`}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={10} />
                              <span>{new Date(expense.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 flex-shrink-0">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(expense)}
                            disabled={isCreatingExpense || isUpdatingExpense}
                            className="p-1.5 sm:p-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-300 border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit expense"
                          >
                            <Edit size={12} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(expense.id)}
                            disabled={isCreatingExpense || isUpdatingExpense}
                            className="p-1.5 sm:p-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete expense"
                          >
                            <Trash2 size={12} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Balance Section with Settlement */}
                      <motion.div 
                        whileHover={{ scale: 1.01 }}
                        className="bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-600/30"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex-1 text-center sm:text-left">
                            {youPaid ? (
                              <div>
                                <p className="text-gray-300 text-xs sm:text-sm mb-1">You paid full amount</p>
                                <p className="text-emerald-400 font-semibold text-sm sm:text-lg mb-1">
                                  {selectedFriend?.name} owes you
                                </p>
                                <p className="text-emerald-300 font-bold text-sm sm:text-xl">
                                  <IndianRupee size={12} className="inline mr-1" />
                                  {friendSplit?.amount || 0}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-gray-300 text-xs sm:text-sm mb-1">{selectedFriend?.name} paid full amount</p>
                                <p className="text-orange-400 font-semibold text-sm sm:text-lg mb-1">
                                  You owe
                                </p>
                                <p className="text-orange-300 font-bold text-sm sm:text-xl">
                                  <IndianRupee size={12} className="inline mr-1" />
                                  {yourSplit?.amount || 0}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* Settle Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSettleExpense(expense)}
                            disabled={isCreatingExpense || isUpdatingExpense}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center gap-2 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/25 text-xs sm:text-base justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle size={12} className="sm:size-4" />
                            <span className="truncate">
                              {youPaid ? 'Received' : 'Paid'}
                            </span>
                          </motion.button>
                        </div>
                        
                        {/* Settlement Note */}
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2 text-center"
                        >
                          <p className="text-gray-400 text-xs">
                            {youPaid 
                              ? `Mark when ${selectedFriend?.name} pays you ₹${amount}` 
                              : `Mark when you pay ${selectedFriend?.name} ₹${amount}`
                            }
                          </p>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Empty State for selected friend */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-12 text-center shadow-xl"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-6"
              >
                <User size={20} className="text-white" />
              </motion.div>
              <h3 className="text-lg sm:text-2xl font-semibold text-white mb-2 sm:mb-3">
                No private expenses yet
              </h3>
              <p className="text-emerald-200/80 text-xs sm:text-lg mb-4 sm:mb-8 max-w-md mx-auto">
                Create your first private expense - it will be hidden from the main group
              </p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                disabled={isCreatingExpense || isUpdatingExpense}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg font-semibold flex items-center gap-2 mx-auto hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-blue-500/25 text-xs sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
                <span>Create Private Expense</span>
              </motion.button>
            </motion.div>
          )
        ) : (
          /* No friend selected state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/60 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-12 text-center shadow-xl"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-6"
            >
              <Users size={20} className="text-white" />
            </motion.div>
            <h3 className="text-lg sm:text-2xl font-semibold text-white mb-2 sm:mb-3">
              Select a friend to get started
            </h3>
            <p className="text-emerald-200/80 text-xs sm:text-lg mb-4 sm:mb-8 max-w-md mx-auto">
              Choose a friend from the dropdown to track private expenses
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FriendExpense;
