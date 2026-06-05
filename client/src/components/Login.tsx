import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, Zap, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { handleGoogleLogin } from '../utils/auth';
import { toast } from 'sonner';

interface LoginProps {
    onToggle: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    
    const loginMutation = useLogin();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const result = await loginMutation.mutateAsync(formData);
            // console.log('Login successful:', result);
            
            //  SUCCESS TOAST
            toast.success('Login successful!', {
                description: 'Welcome back to ExpenseSync',
                duration: 3000,
            });
            
            //  FORM RESET
            setFormData({
                email: '',
                password: ''
            });

            // MANUAL REDIRECT TO DASH
            setTimeout(() => {
                navigate('/dash');
            }, 1000);
            
        } catch (error:any) {
            console.error('Login failed:', error.message);
            
            // ERROR TOAST
            toast.error('Login failed', {
                description: error.message,
                duration: 4000,
            });
        }
    };

    const handleGoogleAuth = async () => {
        setGoogleLoading(true);
        try {
            await handleGoogleLogin();
        } catch (error) {
            // console.error('Google login failed:', error);
            toast.error('Google login failed');
        } finally {
            setGoogleLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -15, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 relative overflow-hidden px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Animated Background Elements */}
            <motion.div
                variants={floatingVariants}
                animate="animate"
                className="hidden sm:block absolute top-16 left-12 text-blue-400/20"
            >
                <LogIn size={36} />
            </motion.div>
            
            <motion.div
                variants={floatingVariants}
                animate="animate"
                transition={{ delay: 1.2 }}
                className="hidden sm:block absolute top-44 right-20 text-blue-400/20"
            >
                <Shield size={32} />
            </motion.div>
            
            <motion.div
                variants={floatingVariants}
                animate="animate"
                transition={{ delay: 0.8 }}
                className="hidden sm:block absolute bottom-28 left-24 text-blue-400/20"
            >
                <User size={40} />
            </motion.div>

            {/* Floating Particles */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -25, 0],
                        x: [0, Math.random() * 15 - 7.5, 0],
                        opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        delay: i * 0.4,
                    }}
                    className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full hidden sm:block"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                />
            ))}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-800/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md border border-gray-700/50 relative z-10"
            >
                {/* Header with Animation */}
                <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ duration: 0.4 }}
                        className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-blue-500/30"
                    >
                        <LogIn size={24} className="sm:w-7 sm:h-7 text-gray-950" />
                    </motion.div>
                    <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">Sign in to continue to ExpenseSync</p>
                </motion.div>

                {/* Google Login Button */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 10px 30px -5px rgba(255, 255, 255, 0.2)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleAuth}
                    disabled={googleLoading || loginMutation.isPending}
                    className="w-full bg-white text-gray-900 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 border border-gray-300 text-sm sm:text-base"
                >
                    {googleLoading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Zap size={18} className="sm:w-5 sm:h-5" />
                        </motion.div>
                    ) : (
                        <>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="font-medium">Continue with Google</span>
                        </>
                    )}
                </motion.button>

                {/* Divider */}
                <motion.div variants={itemVariants} className="flex items-center my-4 sm:my-6">
                    <div className="flex-1 border-t border-gray-600/50"></div>
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="px-3 sm:px-4 text-gray-400 text-xs sm:text-sm font-medium"
                    >
                        OR
                    </motion.div>
                    <div className="flex-1 border-t border-gray-600/50"></div>
                </motion.div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <motion.div variants={itemVariants}>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-10 sm:px-12 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                required
                            />
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-400"
                            >
                                <Mail size={18} className="sm:w-5 sm:h-5" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-10 sm:px-12 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                required
                            />
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-400"
                            >
                                <Lock size={18} className="sm:w-5 sm:h-5" />
                            </motion.div>
                            <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-cyan-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.4)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-2xl shadow-blue-500/30 flex items-center justify-center space-x-2 sm:space-x-3 disabled:opacity-50"
                    >
                        {loginMutation.isPending ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Zap size={18} className="sm:w-5 sm:h-5" />
                            </motion.div>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                            </>
                        )}
                    </motion.button>
                </form>

                {loginMutation.isError && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-xl text-sm backdrop-blur-sm"
                    >
                        {loginMutation.error.message}
                    </motion.div>
                )}

                <motion.div variants={itemVariants} className="mt-6 sm:mt-8 text-center">
                    <button 
                        onClick={onToggle}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center justify-center space-x-2 mx-auto group text-sm sm:text-base"
                    >
                        <span>Don't have an account?</span>
                        <motion.span
                            whileHover={{ x: 5 }}
                            className="font-semibold group-hover:text-cyan-400"
                        >
                            Sign up here
                        </motion.span>
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;






















