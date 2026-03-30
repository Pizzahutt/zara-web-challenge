'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';

interface SimilarProductsProps {
  products: Product[];
}

export default function SimilarProducts({ products }: SimilarProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  /* ── drag-to-scroll state ── */
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const updateScrollbar = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const scrollable = scrollWidth > clientWidth;
    setCanScroll(scrollable);
    if (scrollable) {
      setThumbWidth((clientWidth / scrollWidth) * 100);
      setThumbLeft((scrollLeft / scrollWidth) * 100);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollbar, { passive: true });
    window.addEventListener('resize', updateScrollbar);
    updateScrollbar();
    return () => {
      el.removeEventListener('scroll', updateScrollbar);
      window.removeEventListener('resize', updateScrollbar);
    };
  }, [updateScrollbar]);

  /* ── mouse drag handlers ── */
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX;
    scrollStart.current = scrollRef.current?.scrollLeft ?? 0;
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !scrollRef.current) return;
      const dx = e.pageX - startX.current;
      if (Math.abs(dx) > 3) hasDragged.current = true;
      scrollRef.current.scrollLeft = scrollStart.current - dx;
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-10" role="region" aria-roledescription="carousel" aria-label="Similar products">
      <h2
        className="text-xl uppercase"
        style={{ fontWeight: 300, WebkitTextStroke: '0.3px white' }}
      >
        Similar Items
      </h2>
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onClickCapture={onClickCapture}
        className="flex overflow-x-auto scrollbar-hide -mx-4 md:mx-0 cursor-grab active:cursor-grabbing border-t-[0.5px] border-b-[0.5px] border-l-[0.5px] border-black select-none"
      >
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            draggable={false}
            className="group relative shrink-0 flex flex-col gap-6 border-r-[0.5px] border-black overflow-hidden p-4 w-[200px] h-[200px] md:w-[344px] md:h-[344px]"
            aria-label={`${product.brand} ${product.name}, ${product.basePrice} EUR`}
          >
            {/* Hover overlay — same scaleY animation as ProductCard */}
            <span
              className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-black opacity-0 origin-bottom scale-y-0 group-hover:scale-y-100 group-hover:opacity-100 transition-[transform,opacity] duration-500 ease-out will-change-[transform,opacity] z-0"
              aria-hidden="true"
            />

            <div className="relative flex-1 min-h-0 z-10">
              <Image
                src={product.imageUrl}
                alt={`${product.brand} ${product.name}`}
                fill
                sizes="(max-width: 768px) 200px, 344px"
                className="object-contain pointer-events-none"
                draggable={false}
              />
            </div>
            <div className="relative z-10 flex items-end gap-2 whitespace-nowrap font-light transition-colors duration-500">
              <div className="flex flex-1 flex-col gap-1 min-w-0 uppercase">
                <span className="truncate text-[10px] text-[#79736d] group-hover:text-white/70 transition-colors duration-500">
                  {product.brand}
                </span>
                <span className="truncate text-[12px] text-foreground group-hover:text-white transition-colors duration-500">
                  {product.name}
                </span>
              </div>
              <span className="text-[12px] text-foreground group-hover:text-white transition-colors duration-500 shrink-0 capitalize">
                {product.basePrice} EUR
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Custom scroll indicator — Figma: gray track + black thumb */}
      {canScroll && (
        <div className="relative h-px w-full">
          <div className="absolute inset-0 bg-[#ccc]" />
          <div
            className="absolute top-0 h-px bg-black transition-[left] duration-100 ease-out"
            style={{
              width: `${thumbWidth}%`,
              left: `${thumbLeft}%`,
            }}
          />
        </div>
      )}
    </section>
  );
}
