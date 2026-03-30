'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useCallback } from 'react';

export default function NavigationProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const crawlRef = useRef<ReturnType<typeof setInterval>>();
  const progressRef = useRef(0);
  const isFirstMount = useRef(true);
  const isNavigating = useRef(false);

  const reset = useCallback(() => {
    clearInterval(crawlRef.current);
    progressRef.current = 0;
  }, []);

  const start = useCallback(() => {
    reset();
    isNavigating.current = true;
    const bar = barRef.current;
    const container = containerRef.current;
    if (!bar || !container) return;

    container.style.transition = 'none';
    container.style.opacity = '1';
    bar.style.transition = 'none';
    bar.style.width = '0%';

    // Force reflow
    void bar.offsetWidth;

    // Fast initial jump to 30%
    progressRef.current = 30;
    bar.style.transition = 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)';
    bar.style.width = '30%';

    // Slow crawl toward 85%
    crawlRef.current = setInterval(() => {
      if (progressRef.current < 85) {
        progressRef.current += (85 - progressRef.current) * 0.06;
        if (barRef.current) {
          barRef.current.style.transition = 'width 1s linear';
          barRef.current.style.width = `${progressRef.current}%`;
        }
      }
    }, 1000);
  }, [reset]);

  const done = useCallback(() => {
    clearInterval(crawlRef.current);
    isNavigating.current = false;
    const bar = barRef.current;
    const container = containerRef.current;
    if (!bar || !container) return;

    // Snap to 100%
    bar.style.transition = 'width 200ms cubic-bezier(0.4, 0, 0.2, 1)';
    bar.style.width = '100%';

    // Fade out after reaching 100%
    setTimeout(() => {
      container.style.transition = 'opacity 300ms ease';
      container.style.opacity = '0';

      setTimeout(() => {
        bar.style.transition = 'none';
        bar.style.width = '0%';
        progressRef.current = 0;
      }, 300);
    }, 200);
  }, []);

  // Initial page load: quick sweep animation
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      start();
      const timer = setTimeout(done, 1000);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Route change → complete animation
  useEffect(() => {
    if (!isFirstMount.current && isNavigating.current) {
      done();
    }
  }, [pathname, done]);

  // Intercept internal link clicks to start animation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;

      // Internal navigation
      if (href !== pathname) {
        start();
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [pathname, start]);

  return (
    <div
      ref={containerRef}
      className="fixed left-0 z-50 h-px w-full overflow-hidden pointer-events-none"
      style={{ top: 'var(--header-height)', opacity: 0 }}
      role="progressbar"
      aria-label="Loading"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        ref={barRef}
        className="h-full bg-foreground"
        style={{ width: '0%' }}
      />
    </div>
  );
}
