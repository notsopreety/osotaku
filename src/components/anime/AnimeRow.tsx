import { useRef, useState, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimeCard, AnimeCardSkeleton } from './AnimeCard';
import type { Media } from '@/types/anime';
import { cn } from '@/lib/utils';

interface AnimeRowProps {
  title: string;
  icon?: ReactNode;
  anime: Media[];
  isLoading?: boolean;
  viewAllHref?: string;
}

export function AnimeRow({ title, icon, anime, isLoading, viewAllHref }: AnimeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {viewAllHref && (
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" asChild>
            <a href={viewAllHref}>View All</a>
          </Button>
        )}
      </div>

      <div className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity',
            !canScrollLeft && 'hidden'
          )}
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity',
            !canScrollRight && 'hidden'
          )}
          onClick={() => scroll('right')}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pb-2"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="shrink-0 w-[160px] md:w-[180px]">
                  <AnimeCardSkeleton />
                </div>
              ))
            : anime.map((item, index) => (
                <div key={item.id} className="shrink-0 w-[160px] md:w-[180px]">
                  <AnimeCard anime={item} index={index} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
