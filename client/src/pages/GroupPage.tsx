import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  UserPlus, 
  X, 
  Check,
  Crown,
  Search,
  PieChart,
  Shield,
  User,
  Mail,
  AlertTriangle,
  Info,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useGroups, 
  useCreateGroup, 
  useDeleteGroup, 
  useAddMember, 
  useRemoveMember, 
  useUpdateGroup
} from '../hooks/useGroup';
import { useAuth } from '../context/AuthContext';
import { toast, Toaster } from 'sonner';

const GroupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Hooks
  const { data: groups, isLoading, error } = useGroups();
  const createGroupMutation = useCreateGroup();
  const updateGroupMutation = useUpdateGroup();
  const deleteGroupMutation = useDeleteGroup();
  const addMemberMutation = useAddMember();
  const removeMemberMutation = useRemoveMember();

  // State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  
  // State for member removal confirmation
  const [removingMember, setRemovingMember] = useState<{
    groupId: string; 
    memberId: string; 
    memberEmail: string;
    memberName?: string;
    hasExpenses: boolean;
    expenseCount?: number;
  } | null>(null);

  // FILTER OUT FRIEND GROUPS - sirf normal groups dikhao
  const normalGroups = groups?.filter(group => !group.isDirectFriendGroup) || [];

  // Filter groups based on search
  const filteredGroups = normalGroups?.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if member has expenses in the group
  const checkMemberHasExpenses = (groupId: string, memberId: string) => {
    const group = groups?.find(g => g.id === groupId);
    if (!group || !group.expenses) return { hasExpenses: false, count: 0 };
    
    // Check if member is involved in any expense
    const memberExpenses = group.expenses.filter(expense => 
      expense.payerId === memberId || 
      expense.splits?.some(split => split.userId === memberId)
    );
    
    return { 
      hasExpenses: memberExpenses.length > 0, 
      count: memberExpenses.length 
    };
  };

  // Delete Group Handler
  const handleDeleteGroup = async (groupId: string) => {
    const group = groups?.find(g => g.id === groupId);
    
    if (!group) return;

    // Check if group has expenses
    const hasExpenses = group.expenses && group.expenses.length > 0;
    
    // Mobile-optimized toast for delete confirmation
    toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden w-full max-w-sm mx-4"
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-white" size={18} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm">Delete Group</h3>
                <p className="text-slate-300 text-xs mt-1">
                  Are you sure you want to delete <span className="font-semibold text-white">{group.name}</span>?
                </p>
              </div>
            </div>

            {/* Warning Section - Only show if has expenses */}
            {hasExpenses && (
              <div className="mb-3 p-3 bg-gradient-to-r from-amber-900/20 to-amber-800/10 border border-amber-700/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={12} className="text-amber-400" />
                  <span className="text-amber-300 font-medium text-xs">Warning: Contains {group.expenses.length} expense(s)</span>
                </div>
                <p className="text-slate-400 text-xs">
                  All expense history will be permanently deleted
                </p>
              </div>
            )}

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-col gap-2 mt-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  toast.dismiss(t);
                  await startGroupDeletion(groupId);
                }}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium rounded-lg text-sm hover:from-red-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                {hasExpenses ? 'Delete Anyway' : 'Delete Group'}
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => toast.dismiss(t)}
                className="w-full py-2.5 bg-slate-700/50 text-slate-300 font-medium rounded-lg text-sm hover:bg-slate-600/50 transition-all duration-300 border border-slate-600"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      ),
      {
        duration: Infinity,
        position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
      }
    );
  };

  // Delete group function
  const startGroupDeletion = async (groupId: string) => {
    setDeletingGroupId(groupId);
    
    // Mobile-optimized loading toast
    const loadingToast = toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 w-full max-w-sm mx-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-white text-sm">Deleting Group</p>
              <p className="text-slate-300 text-xs mt-0.5">Please wait...</p>
            </div>
          </div>
        </motion.div>
      ),
      {
        duration: Infinity,
        position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
      }
    );

    try {
      await deleteGroupMutation.mutateAsync(groupId);
      
      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      
      // Mobile-optimized success toast
      toast.success(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
            <Check className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Group Deleted</h4>
            <p className="text-slate-300 text-xs">Group was successfully deleted</p>
          </div>
        </div>,
        { 
          duration: 3000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete group';
      
      // Dismiss loading and show error
      toast.dismiss(loadingToast);
      
      // Mobile-optimized error toast
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
            <X className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Deletion Failed</h4>
            <p className="text-slate-300 text-xs">
              {errorMessage.length > 60 ? errorMessage.substring(0, 60) + '...' : errorMessage}
            </p>
          </div>
        </div>,
        { 
          duration: 5000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
    } finally {
      setDeletingGroupId(null);
    }
  };

  // Handlers with toast notifications
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGroupName.trim()) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Missing Information</h4>
            <p className="text-slate-300 text-xs">Please enter a group name</p>
          </div>
        </div>,
        { 
          duration: 3000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
      return;
    }

    try {
      await createGroupMutation.mutateAsync({ name: newGroupName });
      setNewGroupName('');
      setShowCreateModal(false);
      toast.success(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
            <Check className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Group Created</h4>
            <p className="text-slate-300 text-xs">Group created successfully!</p>
          </div>
        </div>,
        { 
          duration: 3000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
    } catch (error: any) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Creation Failed</h4>
            <p className="text-slate-300 text-xs">{error.response?.data?.error || 'Failed to create group'}</p>
          </div>
        </div>,
        { 
          duration: 4000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
    }
  };

  const handleStartEdit = (groupId: string, currentName: string) => {
    setEditingGroupId(groupId);
    setEditingGroupName(currentName);
    toast.info(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <Edit3 className="text-white" size={16} />
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">Editing Group</h4>
          <p className="text-slate-300 text-xs">Editing group name...</p>
        </div>
      </div>,
      { 
        duration: 2000,
        position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
      }
    );
  };

  const handleSaveEdit = async (groupId: string) => {
    if (!editingGroupName.trim()) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Empty Name</h4>
            <p className="text-slate-300 text-xs">Group name cannot be empty</p>
          </div>
        </div>,
        { 
          duration: 3000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
      return;
    }

    try {
      await updateGroupMutation.mutateAsync({ 
        groupId, 
        data: { name: editingGroupName } 
      });
      setEditingGroupId(null);
      setEditingGroupName('');
      toast.success(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
            <Check className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Group Updated</h4>
            <p className="text-slate-300 text-xs">Group updated successfully!</p>
          </div>
        </div>,
        { 
          duration: 3000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
    } catch (error: any) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Update Failed</h4>
            <p className="text-slate-300 text-xs">{error.response?.data?.error || 'Failed to update group'}</p>
          </div>
        </div>,
        { 
          duration: 4000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditingGroupName('');
    toast.info(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
          <X className="text-white" size={16} />
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">Edit Cancelled</h4>
          <p className="text-slate-300 text-xs">Changes discarded</p>
        </div>
      </div>,
      { 
        duration: 2000,
        position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
      }
    );
  };

  // handleAddMember with OPTIMISTIC UPDATES
  const handleAddMember = async (groupId: string, e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMemberEmail.trim()) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Missing Email</h4>
            <p className="text-slate-300 text-xs">Please enter an email address</p>
          </div>
        </div>,
        { 
          duration: 3000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail)) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Invalid Email</h4>
            <p className="text-slate-300 text-xs">Please enter a valid email address</p>
          </div>
        </div>,
        { 
          duration: 3000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
      return;
    }

    // Check if adding self
    if (newMemberEmail.toLowerCase() === user?.email?.toLowerCase()) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Cannot Add Yourself</h4>
            <p className="text-slate-300 text-xs">You are already a member of this group</p>
          </div>
        </div>,
        { 
          duration: 3000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
      return;
    }

    // Mobile-optimized loading toast
    const loadingToast = toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 w-full max-w-sm mx-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-white text-sm">Adding Member</p>
              <p className="text-slate-300 text-xs mt-0.5">Please wait...</p>
            </div>
          </div>
        </motion.div>
      ),
      {
        duration: Infinity,
        position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
      }
    );

    try {
      const result = await addMemberMutation.mutateAsync({ 
        groupId, 
        data: { email: newMemberEmail } 
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // SUCCESS CASES - Graceful handling
      if (result.type === 'INVITATION_SENT') {
        // Invitation sent to non-registered user
        toast.success(
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Mail className="text-white" size={16} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-sm">Invitation Sent!</h4>
                <p className="text-slate-300 text-xs mt-0.5">
                  Sent to <span className="font-medium text-white">{newMemberEmail}</span>
                </p>
              </div>
            </div>
          </div>,
          { 
            duration: 4000,
            position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
          }
        );
      } else if (result.type === 'MEMBER_ADDED') {
        // Member added successfully
        toast.success(
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
              <Check className="text-white" size={16} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Member Added!</h4>
              <p className="text-slate-300 text-xs">
                Added to group successfully
              </p>
            </div>
          </div>,
          { 
            duration: 3000,
            position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
          }
        );
      }

      setNewMemberEmail('');
      setShowAddMemberModal(null);
      
    } catch (error: any) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      const errorMessage = error.response?.data?.error || error.message || 'Something went wrong';
      
      // GRACEFUL ERROR HANDLING
      if (errorMessage.includes('already a member') || errorMessage.includes('already exists')) {
        toast.error(
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-white" size={16} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Already a Member</h4>
              <p className="text-slate-300 text-xs">
                User is already in the group
              </p>
            </div>
          </div>,
          { 
            duration: 3000,
            position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
          }
        );
      } 
      else if (errorMessage.includes('not registered') || errorMessage.includes('not found')) {
        toast.error(
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-sm">User Not Registered</h4>
                <p className="text-slate-300 text-xs mt-0.5">
                  Please ask them to register first
                </p>
              </div>
            </div>
          </div>,
          { 
            duration: 4000,
            position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
          }
        );
      }
      else {
        // Generic error with graceful message
        toast.error(
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-white" size={16} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-sm">Failed to Add</h4>
                <p className="text-slate-300 text-xs mt-0.5">
                  Please try again
                </p>
              </div>
            </div>
          </div>,
          { 
            duration: 4000,
            position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
          }
        );
      }
    }
  };

  // handleRemoveMember with CONFIRMATION MODAL
  const handleRemoveMember = (groupId: string, memberId: string, memberEmail: string, memberName?: string) => {
    // Check if member has expenses
    const expenseInfo = checkMemberHasExpenses(groupId, memberId);
    
    // Set the removing member state with all info
    setRemovingMember({
      groupId,
      memberId,
      memberEmail,
      memberName,
      hasExpenses: expenseInfo.hasExpenses,
      expenseCount: expenseInfo.count
    });
  };

  // CONFIRM REMOVE MEMBER (called after confirmation)
  const confirmRemoveMember = async () => {
    if (!removingMember) return;

    // Mobile-optimized loading toast
    const loadingToast = toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 w-full max-w-sm mx-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-white text-sm">Removing Member</p>
              <p className="text-slate-300 text-xs mt-0.5">Please wait...</p>
            </div>
          </div>
        </motion.div>
      ),
      {
        duration: Infinity,
        position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
      }
    );

    try {
      await removeMemberMutation.mutateAsync({ 
        groupId: removingMember.groupId, 
        memberId: removingMember.memberId 
      });
      
      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      toast.success(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
            <Check className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Member Removed</h4>
            <p className="text-slate-300 text-xs">
              Member removed from group
            </p>
          </div>
        </div>,
        { 
          duration: 3000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
      
    } catch (error: any) {
      // Dismiss loading and show error
      toast.dismiss(loadingToast);
      toast.error(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="text-white" size={16} />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Removal Failed</h4>
            <p className="text-slate-300 text-xs">{error.response?.data?.error || 'Failed to remove member'}</p>
          </div>
        </div>,
        { 
          duration: 4000,
          position: window.innerWidth < 768 ? 'bottom-center' : 'top-right',
        }
      );
    } finally {
      setRemovingMember(null);
    }
  };

  // Loading animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-4 sm:p-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="animate-pulse">
            <div className="h-8 bg-emerald-800/30 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-800/30 rounded-xl p-4 sm:p-6 h-64">
                  <div className="h-6 bg-emerald-800/30 rounded mb-4"></div>
                  <div className="h-4 bg-emerald-800/30 rounded mb-2"></div>
                  <div className="h-4 bg-emerald-800/30 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-6 sm:p-8 max-w-md">
          <Shield size={40} className="sm:w-12 sm:h-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Error Loading Groups</h3>
          <p className="text-sm sm:text-base">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 relative overflow-hidden">
      {/* Toast Container - Mobile Optimized */}
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'transparent',
            color: '#f8fafc',
            padding: '0',
            margin: '0',
            border: 'none',
            boxShadow: 'none',
            maxWidth: '400px',
            width: '90vw',
          },
          className: 'sonner-toast',
        }}
      />
      
      <div className="relative max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dash')}
              className="p-2 sm:p-3 bg-slate-800/50 rounded-xl text-white hover:bg-slate-700/50 transition-all duration-300 border border-slate-700 hover:border-emerald-500/30"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </motion.button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Groups</h1>
              <p className="text-slate-400 mt-1 text-sm sm:text-base">Manage your expense groups</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative group flex-1 lg:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all duration-300 w-full lg:w-64 text-sm sm:text-base"
              />
            </div>

            {/* Create Group Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-600 transition-all duration-300 text-sm sm:text-base whitespace-nowrap"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Create Group</span>
              <span className="sm:hidden">Create</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Overview - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700 hover:border-emerald-500/30 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm">Total Groups</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{normalGroups?.length || 0}</p>
              </div>
              <Users className="text-emerald-400 group-hover:scale-110 transition-transform" size={20} />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700 hover:border-blue-500/30 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm">Active Members</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {normalGroups?.reduce((acc, group) => acc + (group.members?.length || 0), 0) || 0}
                </p>
              </div>
              <UserPlus className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700 hover:border-amber-500/30 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs sm:text-sm">Admin Groups</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {normalGroups?.filter(g => g.creatorId === user?.id).length || 0}
                </p>
              </div>
              <Crown className="text-amber-400 group-hover:scale-110 transition-transform" size={20} />
            </div>
          </motion.div>
        </div>

        {/* Friend Groups Info Card */}
        {groups && groups.length > normalGroups.length && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <User className="text-blue-400" size={18} />
              <div>
                <h4 className="text-blue-300 font-semibold text-sm sm:text-base">Friend Expenses</h4>
                <p className="text-blue-400 text-xs sm:text-sm">
                  You have {groups.length - normalGroups.length} private friend groups. 
                  Access them from the Friend Expenses tab in any group.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Groups Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredGroups?.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`group bg-slate-800/30 rounded-xl p-4 sm:p-6 border transition-all duration-300 hover:scale-105 ${
                  deletingGroupId === group.id 
                    ? 'border-red-500/50 bg-red-500/10' 
                    : 'border-slate-700 hover:border-emerald-500/50'
                }`}
              >
                {/* Group Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  {editingGroupId === group.id ? (
                    // EDIT MODE
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingGroupName}
                        onChange={(e) => setEditingGroupName(e.target.value)}
                        className="flex-1 p-2 sm:p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-all text-sm sm:text-base"
                        autoFocus
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSaveEdit(group.id)}
                        disabled={!editingGroupName.trim() || updateGroupMutation.isPending}
                        className="p-1 sm:p-2 text-emerald-400 hover:bg-emerald-400/20 rounded-lg transition-colors"
                        title="Save"
                      >
                        <Check size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCancelEdit}
                        className="p-1 sm:p-2 text-slate-400 hover:bg-slate-400/20 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X size={16} />
                      </motion.button>
                    </div>
                  ) : (
                    // VIEW MODE
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
                            {group.name}
                          </h3>
                          {group.creatorId === user?.id && (
                            <Crown size={14} className="text-amber-400 flex-shrink-0" title="Admin" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                          <Users size={12} />
                          <span>{group.members?.length || 0} members</span>
                          {group.expenses && group.expenses.length > 0 && (
                            <>
                              <span>•</span>
                              <PieChart size={12} />
                              <span>{group.expenses.length} expenses</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* EDIT BUTTON */}
                        {group.creatorId === user?.id && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleStartEdit(group.id, group.name)}
                            disabled={deletingGroupId === group.id}
                            className="p-1 sm:p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-all duration-300 disabled:opacity-50"
                            title="Edit Group"
                          >
                            <Edit3 size={14} />
                          </motion.button>
                        )}
                        {/* DELETE BUTTON */}
                        {group.creatorId === user?.id && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteGroup(group.id)}
                            disabled={deletingGroupId === group.id}
                            className="p-1 sm:p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-300 disabled:opacity-50"
                            title="Delete Group"
                          >
                            {deletingGroupId === group.id ? (
                              <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </motion.button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                
                {group.expenses && group.expenses.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-amber-400 text-xs">
                      <Info size={12} />
                      <span>Contains {group.expenses.length} expense(s)</span>
                    </div>
                  </motion.div>
                )}

                {/* Members List */}
                <div className="space-y-2 mb-3 sm:mb-4 max-h-24 sm:max-h-32 overflow-y-auto custom-scrollbar">
                  {group.members && group.members.length > 0 ? (
                    group.members.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg group/item hover:bg-slate-700/50 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
                          <span className="text-white text-xs sm:text-sm truncate">
                            {member.user?.name || member.user?.email || 'Unknown User'}
                          </span>
                          {member.userId === group.creatorId && (
                            <Crown size={10} className="text-amber-400 flex-shrink-0" title="Group Admin" />
                          )}
                        </div>
                        
                        {/* Remove Member Button with CONFIRMATION MODAL */}
                        {group.creatorId === user?.id && 
                         member.userId !== user?.id && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleRemoveMember(
                              group.id, 
                              member.userId, 
                              member.user?.email || 'Unknown User',
                              member.user?.name
                            )}
                            className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-all duration-300
                              sm:opacity-0 sm:group-hover/item:opacity-100
                              opacity-100" // Always visible on mobile
                            title="Remove Member"
                          >
                            <X size={12} />
                          </motion.button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 text-xs sm:text-sm py-2">
                      <UserPlus size={16} className="mx-auto mb-1 opacity-50" />
                      No members yet
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddMemberModal(group.id)}
                    disabled={deletingGroupId === group.id}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium hover:from-emerald-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50"
                  >
                    <UserPlus size={14} />
                    <span className="hidden sm:inline">Add Member</span>
                    <span className="sm:hidden">Add</span>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/groups/${group.id}/expenses`)}
                    disabled={deletingGroupId === group.id}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50"
                  >
                    <PieChart size={14} />
                    <span className="hidden sm:inline">Expenses</span>
                    <span className="sm:hidden">View</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {(!filteredGroups || filteredGroups.length === 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 sm:py-16"
          >
            <div className="bg-slate-800/30 rounded-2xl p-6 sm:p-12 border border-slate-700 max-w-2xl mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users size={28} className="sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">No Groups Found</h3>
              <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">
                {searchTerm ? 'No groups match your search.' : 'Create your first group to start managing expenses.'}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto hover:from-emerald-600 hover:to-green-700 transition-all duration-300 text-sm sm:text-base"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
                Create Your First Group
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Create Group Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-4 sm:p-6 w-full max-w-md border border-slate-700 shadow-2xl"
              >
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Users size={24} className="sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Create New Group</h3>
                  <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">Start managing expenses together</p>
                </div>
                
                <form onSubmit={handleCreateGroup}>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all duration-300 mb-4 text-sm sm:text-base"
                    autoFocus
                  />
                  
                  <div className="flex gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 py-2 sm:py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-all duration-300 text-sm sm:text-base"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!newGroupName.trim() || createGroupMutation.isPending}
                      className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                    >
                      {createGroupMutation.isPending ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </div>
                      ) : (
                        'Create Group'
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Member Modal */}
        <AnimatePresence>
          {showAddMemberModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-4 sm:p-6 w-full max-w-md border border-slate-700 shadow-2xl"
              >
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <UserPlus size={24} className="sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Add Member</h3>
                  <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">Invite someone to your group</p>
                </div>
                
                <form onSubmit={(e) => handleAddMember(showAddMemberModal!, e)}>
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Enter member's email"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all duration-300 mb-4 text-sm sm:text-base"
                    autoFocus
                  />
                  
                  <div className="flex gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setShowAddMemberModal(null);
                        setNewMemberEmail('');
                      }}
                      className="flex-1 py-2 sm:py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-all duration-300 text-sm sm:text-base"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!newMemberEmail.trim() || addMemberMutation.isPending}
                      className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                    >
                      {addMemberMutation.isPending ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adding...
                        </div>
                      ) : (
                        'Add Member'
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        
        <AnimatePresence>
          {removingMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-4 sm:p-6 w-full max-w-md border border-slate-700 shadow-2xl"
              >
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <LogOut size={24} className="sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Remove Member</h3>
                  <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">
                    Are you sure you want to remove{' '}
                    <span className="font-medium text-white">
                      {removingMember.memberName || removingMember.memberEmail}
                    </span>
                    {' '}from the group?
                  </p>
                </div>
                
                
                {removingMember.hasExpenses && (
                  <div className="mb-4 sm:mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={14} className="text-amber-400" />
                      <span className="text-amber-300 font-medium text-sm">Member has expenses</span>
                    </div>
                    <p className="text-slate-300 text-xs">
                      This member has participated in <span className="font-medium text-amber-400">{removingMember.expenseCount}</span> expense(s) in this group.
                    </p>
                    <p className="text-slate-400 text-xs mt-2">
                      <span className="font-medium">Note:</span> Removing them will keep their expense history but they won't be able to access the group anymore.
                    </p>
                  </div>
                )}

                {/*  GENERAL WARNING */}
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <Info size={14} />
                    <span className="font-medium">This action cannot be undone</span>
                  </div>
                  <p className="text-slate-300 text-xs mt-1">
                    The member will lose access to this group and all its expenses.
                  </p>
                </div>
                
                <div className="flex gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setRemovingMember(null)}
                    className="flex-1 py-2 sm:py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-all duration-300 text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmRemoveMember}
                    disabled={removeMemberMutation.isPending}
                    className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {removeMemberMutation.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Removing...
                      </div>
                    ) : (
                      'Remove Member'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(100, 116, 139, 0.2);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.4);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.6);
        }
      `}</style>
    </div>
  );
};

export default GroupPage;
