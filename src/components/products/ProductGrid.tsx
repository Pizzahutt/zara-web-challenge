'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="px-4 md:px-page py-12 text-sm font-light uppercase text-text-secondary">
        No results found
      </p>
    );
  }

  return (
    <div className="px-4 md:px-page">
      <div className="flex flex-wrap border-t-[0.5px] border-l-[0.5px] border-black">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="w-full sm:w-1/2 lg:w-1/5"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <ProductCard product={product} priority={index < 5} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
