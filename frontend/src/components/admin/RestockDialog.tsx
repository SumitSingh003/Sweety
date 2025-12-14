import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRestockSweet } from '@/hooks/useSweets';
import { Sweet } from '@/types';
import { PackagePlus } from 'lucide-react';

interface RestockDialogProps {
  sweet: Sweet;
}

export const RestockDialog = ({ sweet }: RestockDialogProps) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(10);
  const restockMutation = useRestockSweet();

  const handleRestock = async () => {
    await restockMutation.mutateAsync({ sweetId: sweet.id, quantity });
    setOpen(false);
    setQuantity(10);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success/80">
          <PackagePlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Restock {sweet.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Current stock: <span className="font-semibold text-foreground">{sweet.quantity}</span>
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity to Add</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            New stock will be: <span className="font-semibold text-success">{sweet.quantity + quantity}</span>
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRestock}
            disabled={restockMutation.isPending || quantity <= 0}
            className="bg-success hover:bg-success/90"
          >
            {restockMutation.isPending ? 'Restocking...' : 'Restock'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
