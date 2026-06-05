import React from "react";
import { motion } from "framer-motion";
import { ServerOff, WifiOff, ZapOff, Cog } from "lucide-react";

interface Props {
  side: "left" | "right";
  mode: "login" | "signup";
}

const float = {
  animate: {
    y: [0, -16, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const BackendStatusVisual: React.FC<Props> = ({ side, mode }) => {
  const isLogin = mode === "login";

  const accentIcons = isLogin ? "text-blue-400" : "text-emerald-400";
  const gradientText = isLogin
    ? "from-blue-400 to-cyan-500"
    : "from-emerald-400 to-green-500";

  return (
    <>
     {/* desktop */}
      <motion.div
        variants={float}
        animate="animate"
        className={`
          pointer-events-none hidden sm:flex fixed
          top-1/2 ${side === "left" ? "left-6" : "right-6"}
          -translate-y-1/2 z-30
          max-w-[180px]
        `}
      >
        <div
          className={`
            flex flex-col gap-3
            ${side === "left" ? "items-start text-left" : "items-end text-right"}
          `}
        >
          {/* Icons */}
          <div className={`flex gap-2 ${accentIcons} opacity-80`}>
            <ServerOff size={26} />
            <WifiOff size={24} />
            <ZapOff size={22} />
            <Cog size={22} />
          </div>

          {/* Text */}
          <p className="text-sm text-gray-300 leading-snug">
            backend services are down
          </p>
          <p className="text-[11px] text-gray-500">
            system retrying silently
          </p>
        </div>
      </motion.div>

      {/*mobile*/}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          pointer-events-none fixed bottom-4 left-1/2
          -translate-x-1/2 z-30 sm:hidden
        "
      >
        <div
          className="
            flex items-center gap-2 px-4 py-2
            bg-gray-900/80 backdrop-blur-lg
            border border-gray-700/50
            rounded-full shadow-lg
            text-xs text-gray-300
          "
        >
          <div className={`flex gap-1 ${accentIcons}`}>
            <ServerOff size={14} />
            <WifiOff size={14} />
          </div>

          <span
            className={`bg-gradient-to-r ${gradientText} bg-clip-text text-transparent font-medium`}
          >
            backend offline
          </span>
        </div>
      </motion.div>
    </>
  );
};

export default BackendStatusVisual;
