import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, IndianRupee, User, Trash2, Edit, X, AlertCircle,
  Wallet, PieChart, TrendingUp, CreditCard, ShoppingBag, Car,
  Home, GamepadIcon, Utensils, Zap, Sparkles, Clock, MoreVertical,
  Split, HandCoins, Receipt, Loader2, CheckCircle2, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGroupExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from '../hooks/useExpense';
import { ExpenseCategory } from '../api/expenseApi';
import SettlementTab from './SettlementTab';
import { toast, Toaster } from 'sonner';

interface GroupExpenseProps {
  groupId: string;
  groupMembers: any[];
  currentUser: any;
}

const GroupExpense: React.FC<GroupExpenseProps> = ({ groupId, groupMembers, currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [activeExpenseMenu, setActiveExpenseMenu] = useState<string | null>(null);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: ExpenseCategory.OTHER,
    splits: [] as { userId: string; amount: string }[]
  });
  const [errors, setErrors] = useState<{ amount?: string; splits?: string }>({});

  const [newExpenseNotification, setNewExpenseNotification] = useState<any>(null);
  const [localExpenses, setLocalExpenses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'expenses' | 'settlements'>('expenses');
  
  const [isCreatingExpense, setIsCreatingExpense] = useState(false);
  const [isUpdatingExpense, setIsUpdatingExpense] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<{id: string, description: string} | null>(null);

  const { data: expenses, isLoading, error } = useGroupExpenses(groupId);
  const createExpenseMutation = useCreateExpense();
  const updateExpenseMutation = useUpdateExpense();
  const deleteExpenseMutation = useDeleteExpense();

  // Check if group has at least 2 members
  const canCreateExpense = groupMembers.length >= 2;

  // Sync expenses and handle new additions with animation
  useEffect(() => {
    if (expenses) {
      setLocalExpenses(expenses);
    }
  }, [expenses]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeExpenseMenu) {
        setActiveExpenseMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeExpenseMenu]);

  // Calculate equal splits when amount or splits change
  useEffect(() => {
    if (splitType === 'equal' && formData.amount && formData.splits.length > 0) {
      const totalAmount = parseFloat(formData.amount);
      const equalAmount = (totalAmount / formData.splits.length).toFixed(2);
      
      const newSplits = formData.splits.map(split => ({
        ...split,
        amount: equalAmount
      }));
      
      setFormData(prev => ({ ...prev, splits: newSplits }));
    }
  }, [formData.amount, formData.splits.length, splitType]);

  // Validate amount input
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

  // Validate custom splits
  const validateCustomSplits = (): string | null => {
    if (splitType !== 'custom') return null;
    
    const totalAmount = parseFloat(formData.amount);
    
    // Check if any split is negative
    const hasNegativeSplit = formData.splits.some(split => {
      const numAmount = parseFloat(split.amount);
      return numAmount < 0;
    });
    
    if (hasNegativeSplit) {
      return 'Split amounts cannot be negative';
    }
    
    // Check if any split is less than 1 when total is sufficient
    const hasInvalidSmallSplit = formData.splits.some(split => {
      const numAmount = parseFloat(split.amount);
      return numAmount > 0 && numAmount < 1 && totalAmount >= 2;
    });
    
    if (hasInvalidSmallSplit) {
      return 'Split amounts must be at least ₹1';
    }
    
    // Check if splits match total amount
    const totalSplit = formData.splits.reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);
    if (Math.abs(totalSplit - totalAmount) > 0.01) {
      return 'Split amounts must match total amount';
    }
    
    return null;
  };

  // Check if expense is a settlement
  const isSettlementExpense = (expense: any) => {
    return expense.description?.toLowerCase().includes('settlement') || 
           expense.description?.toLowerCase().includes('settle') ||
           expense.category === 'SETTLEMENT';
  };

  // Extract settlement information
  const getSettlementInfo = (expense: any) => {
    if (!expense.splits || expense.splits.length === 0) {
      return { from: 'Unknown', to: 'Unknown', amount: '0' };
    }

    const payer = expense.payer?.name || 'Unknown';
    const firstSplit = expense.splits[0];
    const receiver = groupMembers?.find(m => m.userId === firstSplit.userId)?.user?.name || 'Unknown';
    
    return {
      from: payer,
      to: receiver,
      amount: firstSplit.amount
    };
  };

  // Get original expense reference from settlement description
  const getOriginalExpenseReference = (expense: any) => {
    const desc = expense.description || '';
    const match = desc.match(/for\s+(.+)/i);
    if (match) {
      return match[1];
    }
    return 'group expenses';
  };

  // Filter expenses based on active tab
  const filteredExpenses = localExpenses?.filter(expense => {
    if (activeTab === 'expenses') {
      return !isSettlementExpense(expense);
    } else {
      return isSettlementExpense(expense);
    }
  });

  // Get settlements for SettlementTab
  const settlements = localExpenses?.filter(expense => isSettlementExpense(expense)) || [];

  // Count expenses for tabs
  const expenseCount = localExpenses?.filter(expense => !isSettlementExpense(expense)).length || 0;
  const settlementCount = settlements.length;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
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
      scale: 1.01,
      y: -2,
      boxShadow: "0 10px 30px -8px rgba(16, 185, 129, 0.25)",
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

  const newItemVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  const notificationVariants = {
    hidden: { x: 300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: {
      x: 300,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 360,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Category icons mapping
  const categoryIcons = {
    [ExpenseCategory.FOOD]: Utensils,
    [ExpenseCategory.TRAVEL]: Car,
    [ExpenseCategory.SHOPPING]: ShoppingBag,
    [ExpenseCategory.HOUSING]: Home,
    [ExpenseCategory.ENTERTAINMENT]: GamepadIcon,
    [ExpenseCategory.OTHER]: CreditCard,
    SETTLEMENT: HandCoins
  };

  // Get time ago string
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const expenseDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - expenseDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return expenseDate.toLocaleDateString();
  };

  // Format name for display (with dots for long names)
  const formatName = (name: string) => {
    if (!name) return 'Unknown';
    
    const parts = name.split(' ');
    const firstName = parts[0];
    
    if (firstName.length > 8) {
      return firstName.substring(0, 6) + '..';
    }
    
    return firstName;
  };

  // Get selected members visualization
  const getSelectedMembersVisualization = (splits: any[]) => {
    if (!splits || splits.length === 0) return [];
    
    return splits.map(split => {
      const member = groupMembers?.find(m => m.userId === split.userId);
      return {
        name: member?.user?.name || 'Unknown',
        formattedName: formatName(member?.user?.name || 'Unknown')
      };
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const amountValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0).toString();
      setFormData(prev => ({ ...prev, [name]: amountValue }));
      setErrors(prev => ({ ...prev, amount: undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle split changes
  const handleSplitChange = (index: number, value: string) => {
    const splitValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0).toString();
    
    const newSplits = [...formData.splits];
    newSplits[index].amount = splitValue;
    setFormData(prev => ({ ...prev, splits: newSplits }));
    setErrors(prev => ({ ...prev, splits: undefined }));
  };

  // Add member to splits
  const addMemberToSplit = (memberId: string) => {
    if (!formData.splits.find(split => split.userId === memberId)) {
      const newSplit = { userId: memberId, amount: '' };
      
      if (splitType === 'equal' && formData.amount) {
        const totalAmount = parseFloat(formData.amount);
        const newSplitCount = formData.splits.length + 1;
        const equalAmount = (totalAmount / newSplitCount).toFixed(2);
        
        const updatedSplits = [...formData.splits, newSplit].map(split => ({
          ...split,
          amount: equalAmount
        }));
        
        setFormData(prev => ({ ...prev, splits: updatedSplits }));
      } else {
        setFormData(prev => ({
          ...prev,
          splits: [...prev.splits, newSplit]
        }));
      }
    }
  };

  // Remove member from splits
  const removeMemberFromSplit = (memberId: string) => {
    if (splitType === 'equal' && formData.amount) {
      const newSplits = formData.splits.filter(split => split.userId !== memberId);
      if (newSplits.length > 0) {
        const totalAmount = parseFloat(formData.amount);
        const equalAmount = (totalAmount / newSplits.length).toFixed(2);
        
        const updatedSplits = newSplits.map(split => ({
          ...split,
          amount: equalAmount
        }));
        
        setFormData(prev => ({ ...prev, splits: updatedSplits }));
      } else {
        setFormData(prev => ({ ...prev, splits: [] }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        splits: prev.splits.filter(split => split.userId !== memberId)
      }));
    }
  };

  // Handle split type change
  const handleSplitTypeChange = (type: 'equal' | 'custom') => {
    setSplitType(type);
    
    if (type === 'equal' && formData.amount && formData.splits.length > 0) {
      const totalAmount = parseFloat(formData.amount);
      const equalAmount = (totalAmount / formData.splits.length).toFixed(2);
      
      const newSplits = formData.splits.map(split => ({
        ...split,
        amount: equalAmount
      }));
      
      setFormData(prev => ({ ...prev, splits: newSplits }));
    }
    
    setErrors(prev => ({ ...prev, splits: undefined }));
  };

  // Calculate total split amount
  const totalSplitAmount = formData.splits.reduce((sum, split) => sum + (parseFloat(split.amount) || 0), 0);

  // Get split visualization string
  const getSplitVisualization = (expense: any) => {
    if (!expense.splits || expense.splits.length === 0) return '';
    
    const names = expense.splits.map((split: any) => 
      split.user?.name?.split(' ')[0] || 'Unknown'
    );
    
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} & ${names[1]}`;
    
    return names.slice(0, -1).join(' - ') + ' - ' + names[names.length - 1];
  };

  // Handle form submission with LOADER & TOAST
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountError = validateAmount(formData.amount);
    if (amountError) {
      setErrors(prev => ({ ...prev, amount: amountError }));
      return;
    }

    const splitError = validateCustomSplits();
    if (splitError) {
      setErrors(prev => ({ ...prev, splits: splitError }));
      return;
    }

    const expenseData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      groupId,
      category: formData.category,
      splits: formData.splits.map(split => ({
        userId: split.userId,
        amount: parseFloat(split.amount)
      }))
    };

    // SHOW LOADER & DISABLE BUTTON
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
            {editingExpense ? 'Updating Expense...' : 'Creating Expense...'}
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
        await updateExpenseMutation.mutateAsync({
          expenseId: editingExpense.id,
          data: expenseData
        });
        
        // Dismiss loading and show success
        toast.dismiss(loadingToast);
        toast.success(
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-emerald-400" size={16} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Expense Updated!</h4>
              <p className="text-slate-300 text-xs">Expense updated successfully</p>
            </div>
          </div>,
          { duration: 4000 }
        );
        
        setShowForm(false);
        setEditingExpense(null);
        resetForm();
      } else {
        const newExpense = await createExpenseMutation.mutateAsync(expenseData);
        
        // Dismiss loading and show success
        toast.dismiss(loadingToast);
        toast.success(
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-emerald-400" size={16} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Expense Created!</h4>
              <p className="text-slate-300 text-xs">Expense added successfully</p>
            </div>
          </div>,
          { duration: 4000 }
        );

        setNewExpenseNotification({
          ...newExpense,
          isNew: true
        });
        
        setTimeout(() => {
          setNewExpenseNotification(null);
        }, 3000);
        
        setShowForm(false);
        resetForm();
      }
      
    } catch (error: any) {
      // Dismiss loading and show error
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

  // Reset form
  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: ExpenseCategory.OTHER,
      splits: []
    });
    setEditingExpense(null);
    setSplitType('equal');
    setErrors({});
  };

  // Edit expense
  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      splits: expense.splits.map((split: any) => ({
        userId: split.userId,
        amount: split.amount.toString()
      }))
    });
    setSplitType('custom');
    setShowForm(true);
    setActiveExpenseMenu(null);
    setErrors({});
  };

  // Delete expense with confirmation toast
  const handleDeleteExpense = (expenseId: string, expenseDescription: string = 'Expense') => {
    setActiveExpenseMenu(null);
    setExpenseToDelete({ id: expenseId, description: expenseDescription });
    
    // Show confirmation toast
    const confirmToastId = toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-md bg-gray-800 border border-red-700/50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl ${
            t.visible ? 'animate-in slide-in-from-right-10' : ''
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-red-900/40 to-red-800/20 border-b border-red-700/30">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-400" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Delete Expense</h4>
                <p className="text-red-200/80 text-sm">This action cannot be undone</p>
              </div>
            </div>
          </div>
          
          {/* Body */}
          <div className="p-4">
            <p className="text-gray-300 text-sm mb-4">
              Are you sure you want to delete <span className="text-white font-semibold">"{expenseDescription.length > 30 ? expenseDescription.substring(0, 30) + '...' : expenseDescription}"</span>?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  toast.dismiss(confirmToastId);
                  
                  // Show deleting loader
                  const deleteToastId = toast.loading(
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white text-sm">Deleting Expense...</p>
                        <p className="text-slate-300 text-xs">Please wait</p>
                      </div>
                    </div>,
                    {
                      duration: Infinity,
                      position: 'top-center'
                    }
                  );
                  
                  try {
                    await deleteExpenseMutation.mutateAsync({ 
                      expenseId, 
                      groupId 
                    });
                    
                    // Dismiss loading and show success
                    toast.dismiss(deleteToastId);
                    toast.success(
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                          <Check className="text-emerald-400" size={16} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Expense Deleted!</h4>
                          <p className="text-slate-300 text-xs">Expense removed successfully</p>
                        </div>
                      </div>,
                      { 
                        duration: 4000,
                        position: 'top-center'
                      }
                    );
                    
                    setExpenseToDelete(null);
                    
                  } catch (error: any) {
                    // Dismiss loading and show error
                    toast.dismiss(deleteToastId);
                    
                    const errorMessage = error.response?.data?.error || 'Failed to delete expense';
                    toast.error(
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                          <AlertCircle className="text-red-400" size={16} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">Delete Failed</h4>
                          <p className="text-slate-300 text-xs">{errorMessage}</p>
                        </div>
                      </div>,
                      { 
                        duration: 5000,
                        position: 'top-center'
                      }
                    );
                    
                    setExpenseToDelete(null);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Check size={16} />
                Yes, Delete
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  toast.dismiss(confirmToastId);
                  setExpenseToDelete(null);
                }}
                className="flex-1 bg-gray-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <X size={16} />
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
        style: {
          width: '90%',
          maxWidth: '400px',
          margin: '0 auto'
        }
      }
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 p-3 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="animate-pulse"
          >
            <div className="h-6 sm:h-8 bg-emerald-800/30 rounded w-1/2 sm:w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 sm:h-20 bg-emerald-800/20 rounded-lg"></div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 p-3 sm:p-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm"
          >
            <AlertCircle className="text-red-400 mx-auto mb-2 sm:mb-3" size={24} />
            <p className="text-red-400 text-sm sm:text-base mb-3 sm:mb-4">Error loading expenses: {error.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 text-sm"
            >
              Retry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 p-3 sm:p-6 relative overflow-hidden">
      {/* Toast Container */}
      <Toaster
        position="top-center"
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
            width: '90%',
            maxWidth: '400px',
            margin: '0 auto'
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

      {/* Floating Background Icons - Hidden on mobile for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[Wallet, PieChart, CreditCard, TrendingUp, Zap, Sparkles].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-emerald-400/10 hidden sm:block"
            style={{
              left: `${10 + index * 15}%`,
              top: `${20 + index * 12}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -3, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut"
            }}
          >
            <Icon size={32} />
          </motion.div>
        ))}
      </div>

      {/* Real-time Sync Notification - Mobile optimized */}
      <AnimatePresence>
        {newExpenseNotification && (
          <motion.div
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-3 right-3 left-3 sm:left-auto sm:right-4 z-50 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-3 shadow-2xl shadow-emerald-500/25"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="p-1 bg-emerald-500 rounded-full flex-shrink-0"
              >
                <Zap size={14} className="text-white" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-xs sm:text-sm truncate">New Expense Added!</p>
                <p className="text-emerald-200 text-xs truncate">{newExpenseNotification.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header - Mobile optimized */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6"
        >
          <motion.div variants={itemVariants} className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="p-1.5 sm:p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex-shrink-0"
              >
                <Users className="text-white" size={18} />
              </motion.div>
              <h2 className="text-xl sm:text-3xl font-bold text-white truncate">Group Expenses</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-emerald-200/80 text-xs sm:text-sm">Manage shared expenses</p>
              <motion.div
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-lg border border-emerald-500/30 flex-shrink-0"
              >
                <Zap size={10} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs font-medium">Live</span>
              </motion.div>
            </div>
            
            {/* Warning message for single member groups */}
            {!canCreateExpense && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 mt-2 p-2 bg-orange-500/20 border border-orange-500/30 rounded-lg backdrop-blur-sm"
              >
                <AlertCircle className="text-orange-400 flex-shrink-0" size={14} />
                <p className="text-orange-300 text-xs">
                  Add 2+ members to create expenses
                </p>
              </motion.div>
            )}
          </motion.div>
          
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            disabled={!canCreateExpense || activeTab === 'settlements' || isCreatingExpense}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 sm:px-6 py-2 rounded-lg sm:rounded-xl font-semibold flex items-center gap-2 hover:from-emerald-600 hover:to-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-emerald-500/25 w-full sm:w-auto justify-center"
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </motion.button>
        </motion.div>

        {/* Tabs Section - Mobile Optimized */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <div className="flex space-x-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50">
            {/* Expenses Tab */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('expenses')}
              className={`flex-1 flex items-center justify-center gap-2 px-2 py-3 rounded-lg font-semibold transition-all duration-300 text-sm ${
                activeTab === 'expenses'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Receipt size={18} />
                {/* Show text only on desktop */}
                <span className="hidden sm:inline">Expenses</span>
                {expenseCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === 'expenses' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {expenseCount}
                  </span>
                )}
              </div>
            </motion.button>
            
            {/* Settlements Tab */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('settlements')}
              className={`flex-1 flex items-center justify-center gap-2 px-2 py-3 rounded-lg font-semibold transition-all duration-300 text-sm ${
                activeTab === 'settlements'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <HandCoins size={18} />
                {/* Show text only on desktop */}
                <span className="hidden sm:inline">Settlements</span>
                {settlementCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === 'settlements' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {settlementCount}
                  </span>
                )}
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Add/Edit Expense Form - Fixed for mobile visibility */}
        <AnimatePresence>
          {showForm && (
            <>
              {/* Backdrop for mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 sm:hidden"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              />
              
              {/* Form Container */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="bg-gray-800/95 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-emerald-500/30 p-4 sm:p-6 mb-4 sm:mb-6 shadow-2xl fixed inset-3 sm:inset-auto sm:relative z-50 overflow-y-auto max-h-[85vh] sm:max-h-none"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold text-lg sm:text-xl">
                    {editingExpense ? 'Edit Expense' : 'Add Expense'}
                  </h3>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-white p-1 bg-gray-700/50 rounded-lg"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Description */}
                  <div>
                    <label className="block text-emerald-200 text-sm font-medium mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-300 text-sm sm:text-base"
                      placeholder="Enter expense description"
                      required
                      disabled={isCreatingExpense || isUpdatingExpense} 
                    />
                  </div>

                  {/* Amount and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-emerald-200 text-sm font-medium mb-2">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-700/70 border rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-sm sm:text-base ${
                          errors.amount 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-gray-600 focus:border-emerald-500 focus:ring-emerald-500/20'
                        }`}
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        required
                        disabled={isCreatingExpense || isUpdatingExpense}
                      />
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
                    <div>
                      <label className="block text-emerald-200 text-sm font-medium mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:px-3 text-white focus:outline-none focus:border-emerald-500 transition-all duration-300 text-sm sm:text-base"
                        disabled={isCreatingExpense || isUpdatingExpense} 
                      >
                        {Object.values(ExpenseCategory).map(category => {
                          const IconComponent = categoryIcons[category];
                          return (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Split Management */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <label className="block text-emerald-200 text-sm font-medium">
                        Split Between
                      </label>
                      
                      {/* Split Type Toggle */}
                      <div className="flex bg-gray-700/50 rounded-lg p-1 border border-gray-600/50 w-full sm:w-auto">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSplitTypeChange('equal')}
                          disabled={isCreatingExpense || isUpdatingExpense} 
                          className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 flex items-center gap-1 justify-center ${
                            splitType === 'equal'
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                              : 'text-gray-300 hover:text-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <Split size={12} />
                          Equal
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSplitTypeChange('custom')}
                          disabled={isCreatingExpense || isUpdatingExpense}
                          className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 flex items-center gap-1 justify-center ${
                            splitType === 'custom'
                              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                              : 'text-gray-300 hover:text-white'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <Edit size={12} />
                          Custom
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Selected Members Visualization - Like the image */}
                    {formData.splits.length > 0 && (
                      <div className="mb-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Users size={14} className="text-emerald-400" />
                          <span className="text-emerald-200 text-sm font-medium">SPLIT BETWEEN</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getSelectedMembersVisualization(formData.splits).map((member, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-emerald-500/30"
                            >
                              {member.formattedName}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add Members to Split - Fixed horizontal scroll */}
                    <div className="mb-4">
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {groupMembers && groupMembers.length > 0 ? (
                          groupMembers.map(member => (
                            <motion.button
                              key={member.userId}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => addMemberToSplit(member.userId)}
                              disabled={formData.splits.find(s => s.userId === member.userId) || isCreatingExpense || isUpdatingExpense}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex-shrink-0 min-w-[70px] ${
                                formData.splits.find(s => s.userId === member.userId)
                                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {formatName(member.user?.name || 'Unknown')} +
                            </motion.button>
                          ))
                        ) : (
                          <p className="text-gray-400 text-sm">No members available</p>
                        )}
                      </div>
                    </div>

                    {/* Split Amounts - Fixed mobile layout */}
                    {formData.splits.length > 0 && (
                      <div className="space-y-3 mb-4">
                        <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                          <h4 className="text-emerald-200 text-sm font-medium mb-3">
                            {splitType === 'equal' ? 'Equal Split' : 'Custom Split'} Amounts
                          </h4>
                          <div className="space-y-3 max-h-[200px] sm:max-h-none overflow-y-auto pr-2">
                            {formData.splits.map((split, index) => {
                              const member = groupMembers?.find(m => m.userId === split.userId);
                              return (
                                <motion.div
                                  key={split.userId}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-2 sm:gap-3 py-2"
                                >
                                  <span className="text-white text-sm font-medium min-w-[60px] sm:min-w-[80px] truncate text-xs sm:text-sm">
                                    {formatName(member?.user?.name || 'Unknown')}
                                  </span>
                                  <input
                                    type="number"
                                    value={split.amount}
                                    onChange={(e) => handleSplitChange(index, e.target.value)}
                                    className="flex-1 bg-gray-600/70 border border-gray-500 rounded-lg px-2 sm:px-3 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all duration-300 text-xs sm:text-sm min-w-0"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    disabled={splitType === 'equal' || isCreatingExpense || isUpdatingExpense}
                                  />
                                  <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => removeMemberFromSplit(split.userId)}
                                    disabled={isCreatingExpense || isUpdatingExpense}
                                    className="text-red-400 hover:text-red-300 p-1 hover:bg-red-400/20 rounded-lg transition-all duration-300 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <X size={14} />
                                  </motion.button>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Split Validation */}
                    {formData.amount && formData.splits.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-sm p-3 rounded-lg border ${
                          errors.splits 
                            ? 'bg-red-500/10 border-red-500/30' 
                            : 'bg-gray-700/50 border-gray-600/50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className={`font-medium text-xs sm:text-sm ${
                            Math.abs(totalSplitAmount - parseFloat(formData.amount)) > 0.01 
                              ? 'text-red-400' 
                              : 'text-emerald-200'
                          }`}>
                            Total: ₹{totalSplitAmount.toFixed(2)} / ₹{formData.amount}
                          </span>
                          {(errors.splits || Math.abs(totalSplitAmount - parseFloat(formData.amount)) > 0.01) && (
                            <span className="text-red-400 text-xs font-medium">
                              {errors.splits || 'Amounts must match exactly!'}
                            </span>
                          )}
                        </div>
                        {splitType === 'equal' && formData.splits.length > 0 && (
                          <div className="text-emerald-300 text-xs mt-1">
                            Each person pays: ₹{(parseFloat(formData.amount) / formData.splits.length).toFixed(2)}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={
                        !formData.description || 
                        !formData.amount || 
                        formData.splits.length === 0 ||
                        Math.abs(totalSplitAmount - parseFloat(formData.amount)) > 0.01 ||
                        errors.amount ||
                        errors.splits ||
                        isCreatingExpense ||
                        isUpdatingExpense
                      }
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-emerald-500/25 text-sm sm:text-base flex items-center justify-center gap-2"
                    >
                      {isCreatingExpense || isUpdatingExpense ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {editingExpense ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        editingExpense ? 'Update Expense' : 'Create Expense'
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      disabled={isCreatingExpense || isUpdatingExpense}
                      className="px-4 sm:px-6 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Expenses/Settlements List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {activeTab === 'settlements' ? (
            <SettlementTab
              settlements={settlements}
              groupMembers={groupMembers}
              formatName={formatName}
              getTimeAgo={getTimeAgo}
              getSettlementInfo={getSettlementInfo}
              getOriginalExpenseReference={getOriginalExpenseReference}
            />
          ) : filteredExpenses && filteredExpenses.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredExpenses.map((expense, index) => {
                const CategoryIcon = categoryIcons[expense.category];
                const isNew = expense.id === newExpenseNotification?.id;
                const splitVisualization = getSplitVisualization(expense);
                
                return (
                  <motion.div
                    key={expense.id}
                    variants={isNew ? newItemVariants : cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    whileHover="hover"
                    className={`bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border ${
                      isNew 
                        ? 'border-emerald-500/50 shadow-lg sm:shadow-2xl shadow-emerald-500/25'
                        : 'border-gray-700/50 hover:border-emerald-500/30'
                    } p-4 sm:p-6 transition-all duration-300 relative overflow-hidden`}
                  >
                    {/* New Expense Highlight Effect */}
                    {isNew && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none"
                      />
                    )}
                    
                    <div className="flex flex-col gap-4">
                      {/* Top Section - Main info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <motion.div
                            whileHover={{ scale: 1.05, rotate: 3 }}
                            className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex-shrink-0 mt-0.5"
                          >
                            <CategoryIcon size={18} className="text-white" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                              {expense.description}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <div className="flex items-center gap-1 text-xs text-emerald-300">
                                <User size={12} />
                                <span className="truncate">{expense.payer?.name || 'Unknown'}</span>
                              </div>
                              <span className="text-gray-500">•</span>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock size={12} />
                                <span>{getTimeAgo(expense.createdAt)}</span>
                              </div>
                            </div>
                            
                            {/* Split Visualization - Mobile & Desktop */}
                            <div className="mt-2">
                              <div className="flex items-center gap-2 text-xs text-emerald-200">
                                <Users size={12} />
                                <span className="truncate">{splitVisualization}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Amount and Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <motion.span 
                            whileHover={{ scale: 1.02 }}
                            className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
                          >
                            <IndianRupee size={14} />
                            {expense.amount}
                          </motion.span>
                          
                          {/* Menu Button */}
                          <div className="relative">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveExpenseMenu(activeExpenseMenu === expense.id ? null : expense.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600/50 rounded-lg transition-all duration-300"
                            >
                              <MoreVertical size={18} />
                            </motion.button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {activeExpenseMenu === expense.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                  className="absolute right-0 top-10 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-10 min-w-[140px] overflow-hidden"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => handleEdit(expense)}
                                    className="w-full text-left px-4 py-3 text-sm text-blue-400 hover:bg-blue-500/20 flex items-center gap-3 transition-colors border-b border-gray-600"
                                  >
                                    <Edit size={16} />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteExpense(expense.id, expense.description)}
                                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-3 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                    Delete
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* Split Details - Enhanced for both mobile and desktop */}
                      <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                        <h4 className="text-emerald-200 text-sm font-medium mb-3 flex items-center gap-2">
                          <Users size={16} />
                          Split Between:
                        </h4>
                        <div className="space-y-2">
                          {expense.splits && expense.splits.map((split, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex justify-between items-center text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <span className="text-gray-300 truncate">
                                  {split.user?.name || 'Unknown'}
                                  {split.userId === expense.payerId && (
                                    <span className="text-emerald-400 text-xs ml-2">(Paid)</span>
                                  )}
                                </span>
                              </div>
                              <span className="text-emerald-400 font-medium flex items-center gap-1">
                                <IndianRupee size={12} />
                                {split.amount}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 p-8 sm:p-12 text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Receipt size={28} className="text-white" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
                No expenses yet
              </h3>
              <p className="text-emerald-200/80 text-sm mb-6 max-w-md mx-auto">
                {canCreateExpense 
                  ? 'Start by adding your first group expense' 
                  : 'Add at least 2 members to create expenses'
                }
              </p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                disabled={!canCreateExpense}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto hover:from-emerald-600 hover:to-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-emerald-500/25 text-base"
              >
                <Plus size={18} />
                {canCreateExpense ? 'Create First Expense' : 'Add Members'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Custom CSS for scrollbar hiding */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default GroupExpense;
