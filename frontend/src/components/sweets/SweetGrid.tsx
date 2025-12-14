import { Sweet } from '@/types';
import { SweetCard } from './SweetCard';
import { Loader2, Package } from 'lucide-react';

interface SweetGridProps {
  sweets: Sweet[] | undefined;
  isLoading: boolean;
}

export const SweetGrid = ({ sweets, isLoading }: SweetGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sweets || sweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground">
          No sweets found
        </h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sweets.map((sweet, index) => (
        <div
          key={sweet.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <SweetCard sweet={sweet} />
        </div>
      ))}
    </div>
  );
};
