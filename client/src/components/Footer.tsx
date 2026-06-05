import React from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart, 
  ArrowUp,
  Wallet,
  Zap,
  Users,
  Shield
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'API', href: '#' },
      { name: 'Integrations', href: '#' }
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Status', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/100NikhilBro/ExpenseSync', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/in/nikhil-gupta-61b193282', label: 'LinkedIn' },
    { icon: Mail, href: '6174nikhilgupta@gmail.com', label: 'Email' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const circleVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.1,
      rotate: 360,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (delay: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          
          {/* Left Section - Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                <motion.div
                  key={category}
                  custom={categoryIndex * 0.1}
                  variants={itemVariants}
                >
                  <h3 className="text-green-400 font-bold text-lg mb-4 capitalize">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link, linkIndex) => (
                      <motion.li
                        key={link.name}
                        custom={categoryIndex * 0.1 + linkIndex * 0.05}
                        variants={itemVariants}
                        whileHover={{ x: 5, color: '#10b981' }}
                      >
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm sm:text-base"
                        >
                          {link.name}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Middle Section - Animated Circle */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex justify-center order-1 lg:order-2 mb-8 lg:mb-0"
          >
            <motion.div
              variants={circleVariants}
              className="relative"
            >
              {/* Outer Circle */}
              <div className="w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full border-2 border-green-400/30 relative mx-auto">
                
                {/* Rotating Border Effect */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-400 border-r-green-400"
                />
                
                {/* Inner Circle */}
                <div className="absolute inset-3 sm:inset-6 lg:inset-8 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/20 backdrop-blur-sm flex items-center justify-center">
                  
                  {/* Logo */}
                  <motion.div
                    variants={logoVariants}
                    whileHover="hover"
                    className="text-center"
                  >
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Wallet size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-950" />
                      </div>
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      ExpenseSync
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">
                      Split Smart, Live Better
                    </p>
                  </motion.div>

                  {/* Floating Icons Around Circle */}
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0"
                  >
                    {[Zap, Users, Shield].map((Icon, index) => (
                      <motion.div
                        key={index}
                        className="absolute"
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `rotate(${index * 120}deg) translate(4rem) rotate(-${index * 120}deg)`
                        }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                          className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Icon size={12} className="sm:w-4 sm:h-4 text-gray-950" />
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section - Social & Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="text-center lg:text-right order-3"
          >
            <motion.div
              custom={0.2}
              variants={itemVariants}
              className="mb-6"
            >
              <h3 className="text-green-400 font-bold text-lg mb-4">
                Connect With Us
              </h3>
              <div className="flex justify-center lg:justify-end space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    custom={0.3 + index * 0.1}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.2, 
                      y: -5,
                      color: '#10b981'
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-green-400 transition-all duration-200 p-2 rounded-lg bg-gray-800/50 hover:bg-green-500/10"
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              custom={0.4}
              variants={itemVariants}
              className="space-y-3 text-gray-400 text-sm"
            >
              <p className="flex items-center justify-center lg:justify-end space-x-2">
                {/* <Mail size={16} /> */}
                {/* <span>ExpenseSync@gmail.com</span> */}
              </p>
              <p className="flex items-center justify-center lg:justify-end space-x-2">
                {/* <span>🌍</span> */}
                {/* <span>Available worldwide</span> */}
              </p>
              <p className="flex items-center justify-center lg:justify-end space-x-2">
                {/* <span>🕒</span> */}
                {/* <span>24/7 Support</span> */}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex items-center space-x-2 text-gray-400 text-sm"
            >
              {/* <span>© {currentYear} ExpenseSync. Made with</span> */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {/* <Heart size={16} className="text-red-400 fill-current" /> */}
              </motion.div>
              {/* <span>for you</span> */}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="flex items-center space-x-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-lg border border-green-400/20 hover:bg-green-500/20 transition-all duration-200"
            >
              <span>Back to Top</span>
              <ArrowUp size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
