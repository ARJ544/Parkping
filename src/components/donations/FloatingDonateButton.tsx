import React, { useRef } from 'react';
import { motion } from 'framer-motion';

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
        dragConstraints={constraintsRef} // Keeps button inside screen bounds
        dragElastic={0.1}               // Gives a slight rubber-band bounce at edges
        dragMomentum={false}            // Stops it from sliding after release
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenModal}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 cursor-grab active:cursor-grabbing items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 group select-none touch-none"
        title="Support Us"
      >
        <span className="text-xl group-hover:animate-pulse">☕</span>
      </motion.button>
    </>
  );
};
