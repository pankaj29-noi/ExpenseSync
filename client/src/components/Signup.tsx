import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Wallet, Users, Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/useAuth';
import { handleGoogleLogin } from '../utils/auth';
import { toast } from 'sonner';

interface SignupProps {
    onToggle: () => void;
}

const Signup: React.FC<SignupProps> = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const navigate = useNavigate();
    
    const signupMutation = useSignup();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const result = await signupMutation.mutateAsync(formData);
            // console.log('Signup successful:', result);
            
            //  SUCCESS TOAST
            toast.success('Account created successfully! 🎉', {
                description: 'Welcome to ExpenseSync!',
                duration: 3000,
            });
            
            //  FORM RESET
            setFormData({
                name: '',
                email: '',
                password: ''
            });

          
            
        } catch (error: any) {
            // console.error('Signup failed:', error.message);
            
          
            toast.error('Signup failed', {
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
            console.error('Google login failed:', error);
            toast.error('Google login failed');
        } finally {
            setGoogleLoading(false);
        }
    };

    // Floating animation variants
    const floatingVariants = {
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-emerald-950 relative overflow-hidden px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Animated Background Elements - Hidden on mobile, visible on tablet and up */}
            <motion.div
                variants={floatingVariants}
                animate="animate"
                className="hidden md:block absolute top-20 left-10 text-green-400/20"
            >
                <Wallet size={40} />
            </motion.div>
            
            <motion.div
                variants={floatingVariants}
                animate="animate"
                transition={{ delay: 1 }}
                className="hidden md:block absolute top-40 right-16 text-emerald-400/20"
            >
                <Users size={35} />
            </motion.div>
            
            <motion.div
                variants={floatingVariants}
                animate="animate"
                transition={{ delay: 2 }}
                className="hidden lg:block absolute bottom-32 left-20 text-green-400/20"
            >
                <Shield size={45} />
            </motion.div>

            {/* Floating Particles - Reduced on mobile */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                    }}
                    className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-green-400 rounded-full"
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
                className="bg-gray-800/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md border border-gray-700/50 relative z-10"
            >
                {/* Header with Animation */}
                <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-green-500/30"
                    >
                        <Wallet size={24} className="text-gray-950 sm:w-6 sm:h-6" />
                    </motion.div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                        Join ExpenseSync
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">Start splitting expenses like a pro</p>
                </motion.div>

                {/* Google Login Button */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleAuth}
                    disabled={googleLoading || signupMutation.isPending}
                    className="w-full p-3 bg-white text-gray-800 rounded-xl font-medium mb-6 flex items-center justify-center gap-3 hover:bg-gray-100 disabled:opacity-50 transition-all duration-300"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {googleLoading ? 'Redirecting...' : 'Continue with Google'}
                </motion.button>

                <motion.div variants={itemVariants} className="flex items-center mb-6">
                    <div className="flex-1 border-t border-gray-600"></div>
                    <span className="px-4 text-gray-400 text-sm">OR</span>
                    <div className="flex-1 border-t border-gray-600"></div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <motion.div variants={itemVariants}>
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                required
                            />
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"
                            >
                                <Users size={18} className="sm:w-5 sm:h-5" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                required
                            />
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400"
                            >
                                <Sparkles size={18} className="sm:w-5 sm:h-5" />
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
                                className="w-full px-10 sm:px-12 py-3 sm:py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                required
                            />
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400"
                            >
                                <Shield size={18} className="sm:w-6 sm:h-6" />
                            </motion.div>
                            <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-emerald-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.4)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={signupMutation.isPending}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-gray-950 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-2xl shadow-green-500/30 flex items-center justify-center space-x-2 sm:space-x-3 disabled:opacity-50"
                    >
                        {signupMutation.isPending ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Zap size={18} className="sm:w-5 sm:h-5" />
                            </motion.div>
                        ) : (
                            <>
                                <span className="text-sm sm:text-base">Create Account</span>
                                <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                            </>
                        )}
                    </motion.button>
                </form>

                {signupMutation.isError && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-xl text-sm backdrop-blur-sm"
                    >
                        {signupMutation.error.message}
                    </motion.div>
                )}

                <motion.div variants={itemVariants} className="mt-6 sm:mt-8 text-center">
                    <button 
                        onClick={onToggle}
                        className="text-green-400 hover:text-green-300 transition-colors duration-300 flex items-center justify-center space-x-2 mx-auto group text-sm sm:text-base"
                    >
                        <span>Already have an account?</span>
                        <motion.span
                            whileHover={{ x: 5 }}
                            className="font-semibold group-hover:text-emerald-400"
                        >
                            Login here
                        </motion.span>
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Signup;

