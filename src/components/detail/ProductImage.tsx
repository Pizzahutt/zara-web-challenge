'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

interface ProductImageProps {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="relative w-full aspect-[510/630] md:w-[510px] md:h-[630px] shrink-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 510px"
            className="object-contain"
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
