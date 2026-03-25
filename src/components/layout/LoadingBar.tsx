'use client';

import { motion } from 'framer-motion';

export default function LoadingBar() {
  return (
    <div
      className="fixed left-0 z-50 h-px w-full overflow-hidden"
      style={{ top: 'var(--header-height)' }}
      role="progressbar"
      aria-label="Loading"
    >
      <motion.div
        className="h-full bg-foreground"
        initial={{ width: '0%' }}
        animate={{ width: '90%' }}
        transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}
