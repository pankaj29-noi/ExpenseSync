import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Save, Key, User, LogOut, ArrowLeft, Mail, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useGetProfile, useUpdateProfile, useChangePassword, useLogout } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// Beautiful SVG Background Component
const AnimatedBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Floating Icons */}
    {[User, Key, Mail, Settings, LogOut, Save].map((Icon, index) => (
      <motion.div
        key={index}
        className="absolute text-emerald-400/20"
        style={{
          left: `${15 + index * 12}%`,
          top: `${25 + index * 6}%`,
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
        <Icon size={28} />
      </motion.div>
    ))}
    
    {/* Floating Particles */}
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
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

    {/* Animated Gradient Orbs */}
    <motion.div
      className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-green-600/10 rounded-full blur-3xl"
      animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.4, 0.2, 0.4],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
    />
  </div>
);

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Profile Data States
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  
  // Password Data States
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Tanstack Query Hooks
  const { data: profile, isLoading, error, refetch } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const logoutMutation = useLogout();

  // DEBUG: Check session and token
  useEffect(() => {
    const debugAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // console.log(' DEBUG Session:', session);
      // console.log('DEBUG Token:', session?.access_token);
      // console.log(' DEBUG User:', user);
      
      // Test API call directly
      if (session?.access_token) {
        try {
          const testResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/me`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          // console.log(' DEBUG API Test Status:', testResponse.status);
          // console.log(' DEBUG API Test OK:', testResponse.ok);
        } catch (err) {
          // console.log('DEBUG API Test Error:', err);
        }
      }
    };
    debugAuth();
  }, [user]);

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || ''
      });
    }
  }, [profile]);

  // Handle Profile Update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfileMutation.mutateAsync(profileData);
      toast.success('Profile updated successfully!', {
        duration: 3000,
      });
    } catch (error: any) {
      toast.error('Profile update failed', {
        description: error.message,
        duration: 4000,
      });
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match', {
        duration: 4000,
      });
      return;
    }

    try {
      await changePasswordMutation.mutateAsync(passwordData);
      toast.success('Password changed successfully!', {
        duration: 3000,
      });
      
      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error('Password change failed', {
        description: error.message,
        duration: 4000,
      });
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Logged out successfully', {
        duration: 3000,
      });
      navigate('/');
    } catch (error: any) {
      toast.error('Logout failed', {
        description: error.message,
        duration: 4000,
      });
    }
  };

  // Retry profile fetch
  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto mb-3"
          />
          <p className="text-white text-sm">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-red-500/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm relative z-10 max-w-sm mx-4"
        >
          <h2 className="text-red-300 text-lg font-bold mb-2">Error Loading Profile</h2>
          <p className="text-gray-300 text-sm mb-4">Failed to load profile details</p>
          <div className="space-y-2">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRetry}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
            >
              Retry
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dash')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
            >
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-gray-900 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="max-w-lg mx-auto px-4 py-8 relative z-10">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dash')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-gray-800/60 backdrop-blur-lg px-4 py-2 rounded-xl border border-gray-700/50 shadow-lg"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-lg"
            >
              <Settings className="text-white" size={20} />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">
              Profile Settings
            </h1>
          </div>
        </motion.div>
        
        <div className="space-y-6">
          {/* Profile Information Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/30 rounded-lg">
                <User className="w-5 h-5 text-emerald-300" />
              </div>
              Personal Information
            </h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pl-10 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                </motion.div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pl-10 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter your email"
                  />
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-lg"
              >
                {updateProfileMutation.isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Save className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
              </motion.button>
            </form>
          </motion.div>

          {/* Password Change Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-500/30 rounded-lg">
                <Key className="w-5 h-5 text-blue-300" />
              </div>
              Change Password
            </h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 pr-10 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter current password"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.button>
                </motion.div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 pr-10 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter new password"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.button>
                </motion.div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 pr-10 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Confirm new password"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.button>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-lg"
              >
                {changePasswordMutation.isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Key className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Key className="w-5 h-5" />
                )}
                {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Account Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl mt-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Account Actions</h2>
          
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-lg"
            >
              {logoutMutation.isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <LogOut className="w-5 h-5" />
                </motion.div>
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
