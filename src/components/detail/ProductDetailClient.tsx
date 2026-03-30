'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProduct } from '@/hooks/useProduct';
import { useCart } from '@/context/CartContext';
import BackButton from '@/components/detail/BackButton';
import ProductImage from '@/components/detail/ProductImage';
import StorageSelector from '@/components/detail/StorageSelector';
import ColorSelector from '@/components/detail/ColorSelector';
import AddToCartButton from '@/components/detail/AddToCartButton';
import ProductSpecs from '@/components/detail/ProductSpecs';
import SimilarProducts from '@/components/detail/SimilarProducts';

interface ProductDetailClientProps {
  id: string;
}

export default function ProductDetailClient({ id }: ProductDetailClientProps) {
  const { data: product, isLoading, error } = useProduct(id);
  const { addItem } = useCart();
  const router = useRouter();

  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Preload all color variant images so transitions are instant
  useEffect(() => {
    if (!product) return;
    product.colorOptions.forEach((opt) => {
      const img = new window.Image();
      img.src = opt.imageUrl;
    });
  }, [product]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="px-4 md:px-page py-20 text-center">
        <p className="font-light text-lg">Product not found</p>
      </div>
    );
  }

  const selectedColorOption = product.colorOptions.find(
    (c) => c.name === selectedColor,
  );
  const selectedStorageOption = product.storageOptions.find(
    (s) => s.capacity === selectedStorage,
  );

  const displayImage = selectedColorOption?.imageUrl ?? product.colorOptions[0]?.imageUrl ?? '';
  const lowestPrice = Math.min(...product.storageOptions.map((s) => s.price));
  const displayPrice = selectedStorageOption?.price ?? lowestPrice;
  const showFrom = !selectedStorageOption;

  const canAddToCart = selectedStorage !== null && selectedColor !== null;

  const handleAddToCart = () => {
    if (!canAddToCart || !selectedColorOption || !selectedStorageOption) return;
    addItem({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      imageUrl: selectedColorOption.imageUrl,
      color: selectedColor!,
      storage: selectedStorage!,
      price: selectedStorageOption.price,
    });
    router.push('/cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <BackButton />

      <div>
        {/* Hero: image + info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-0 py-10 md:py-16 max-w-[1200px] mx-auto px-4">
          <ProductImage
            src={displayImage}
            alt={`${product.brand} ${product.name}`}
          />

          <div className="flex flex-col gap-16 md:w-[380px]">
            {/* Title + Price */}
            <div className="flex flex-col gap-3 font-light">
              <h1 className="text-2xl uppercase">{product.name}</h1>
              <p className="text-xl capitalize">{showFrom ? 'from ' : ''}{displayPrice} EUR</p>
            </div>

            {/* Selectors */}
            <div className="flex flex-col gap-10">
              <StorageSelector
                options={product.storageOptions}
                selected={selectedStorage}
                onSelect={setSelectedStorage}
              />
              <ColorSelector
                options={product.colorOptions}
                selected={selectedColor}
                onSelect={setSelectedColor}
              />
            </div>

            <AddToCartButton
              disabled={!canAddToCart}
              onClick={handleAddToCart}
            />
          </div>
        </div>

        {/* Specs */}
        <div className="py-10 md:py-16 max-w-[1200px] mx-auto px-4">
          <ProductSpecs
            specs={product.specs}
            brand={product.brand}
            name={product.name}
            description={product.description}
          />
        </div>

        {/* Similar Items */}
        <div className="py-10 md:py-16 pb-20 md:pb-24 max-w-[1200px] mx-auto px-4">
          <SimilarProducts products={product.similarProducts} />
        </div>
      </div>
    </motion.div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="px-4 md:px-page animate-pulse" aria-busy="true" aria-label="Loading product details">
      <div className="h-10 w-20 mt-3" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-10 md:gap-16 py-10 md:py-16">
        <div className="bg-gray-200 w-full md:w-[510px] aspect-[510/630]" />
        <div className="flex flex-col gap-16 md:w-[380px]">
          <div className="flex flex-col gap-3">
            <div className="h-7 bg-gray-200 w-3/4" />
            <div className="h-6 bg-gray-200 w-1/3" />
          </div>
          <div className="flex flex-col gap-10">
            <div className="h-20 bg-gray-200" />
            <div className="h-16 bg-gray-200" />
          </div>
          <div className="h-14 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
