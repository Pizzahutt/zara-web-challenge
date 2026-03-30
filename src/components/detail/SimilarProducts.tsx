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
  const thumbRef = useRef<HTMLDivElement>(null);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  /* ── drag-to-scroll state (carousel) ── */
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  /* ── drag-to-scroll state (scrollbar thumb) ── */
  const trackRef = useRef<HTMLDivElement>(null);
  const isThumbDragging = useRef(false);
  const thumbStartX = useRef(0);
  const thumbScrollStart = useRef(0);

  const updateScrollbar = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const scrollable = scrollWidth > clientWidth;
    setCanScroll(scrollable);
    if (scrollable) {
      const w = (clientWidth / scrollWidth) * 100;
      const l = (scrollLeft / scrollWidth) * 100;
      setThumbWidth(w);
      setThumbLeft(l);
      // Direct DOM update for instant feedback during drag
      if (thumbRef.current) {
        thumbRef.current.style.width = `${w}%`;
        thumbRef.current.style.left = `${l}%`;
      }
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
      if (!scrollRef.current) return;

      /* carousel drag */
      if (isDragging.current) {
        const dx = e.pageX - startX.current;
        if (Math.abs(dx) > 3) hasDragged.current = true;
        scrollRef.current.scrollLeft = scrollStart.current - dx;
      }

      /* scrollbar thumb drag */
      if (isThumbDragging.current && trackRef.current) {
        const track = trackRef.current;
        const trackRect = track.getBoundingClientRect();
        const dx = e.clientX - thumbStartX.current;
        const ratio = dx / trackRect.width;
        const { scrollWidth, clientWidth } = scrollRef.current;
        scrollRef.current.scrollLeft = thumbScrollStart.current + ratio * (scrollWidth - clientWidth);
      }
    };
    const onMouseUp = () => {
      isDragging.current = false;
      if (isThumbDragging.current) {
        isThumbDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    /* touch handlers for scrollbar thumb drag */
    const onTouchMove = (e: TouchEvent) => {
      if (!isThumbDragging.current || !scrollRef.current || !trackRef.current) return;
      const touch = e.touches[0];
      const track = trackRef.current;
      const trackRect = track.getBoundingClientRect();
      const dx = touch.clientX - thumbStartX.current;
      const ratio = dx / trackRect.width;
      const { scrollWidth, clientWidth } = scrollRef.current;
      scrollRef.current.scrollLeft = thumbScrollStart.current + ratio * (scrollWidth - clientWidth);
    };
    const onTouchEnd = () => {
      if (isThumbDragging.current) {
        isThumbDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  /* ── scrollbar track click / thumb drag ── */
  const startTrackDrag = useCallback((clientX: number) => {
    if (!scrollRef.current || !trackRef.current) return;
    const track = trackRef.current;
    const trackRect = track.getBoundingClientRect();
    const clickRatio = (clientX - trackRect.left) / trackRect.width;
    const { scrollWidth, clientWidth } = scrollRef.current;

    scrollRef.current.scrollLeft = clickRatio * (scrollWidth - clientWidth);

    isThumbDragging.current = true;
    thumbStartX.current = clientX;
    thumbScrollStart.current = scrollRef.current.scrollLeft;
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, []);

  const onTrackMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startTrackDrag(e.clientX);
  }, [startTrackDrag]);

  const onTrackTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    startTrackDrag(e.touches[0].clientX);
  }, [startTrackDrag]);

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

      {/* Custom scroll indicator — draggable */}
      {canScroll && (
        <div
          ref={trackRef}
          onMouseDown={onTrackMouseDown}
          onTouchStart={onTrackTouchStart}
          className="relative h-11 -mt-[34px] w-full cursor-pointer touch-none md:h-6 md:-mt-[22px]"
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-[#ccc]" />
          <div
            ref={thumbRef}
            className="absolute top-1/2 -translate-y-1/2 h-px bg-black"
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
