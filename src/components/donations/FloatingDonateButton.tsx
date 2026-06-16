import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

interface FloatingDonateButtonProps {
  onOpenModal: () => void;
}

export const FloatingDonateButton: React.FC<FloatingDonateButtonProps> = ({ onOpenModal }) => {
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-4 pointer-events-none z-40" />
      <motion.button
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        whileHover={{
          scale: 1.1,
          rotate: -3,
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenModal}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 cursor-grab active:cursor-grabbing items-center justify-center rounded-full bg-amber-600 text-white shadow-lg shadow-amber-500/25 hover:bg-amber-700 group select-none touch-none transition-colors"
        title="Support Us"
      >
        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-amber-700 dark:border-amber-100"
          animate={{
            scale: [1, 1.4],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />

        {/* Coffee Icon */}
        <motion.div
          animate={{
            y: [0, -4, 0],
            rotate: [0, -4, 4, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Coffee size={30} strokeWidth={3} />
        </motion.div>
      </motion.button>
    </>
  );
};
