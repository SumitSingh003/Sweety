import { useState } from 'react';
import { Sweet } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, AlertTriangle, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface SweetCardProps {
  sweet: Sweet;
}

export const SweetCard = ({ sweet }: SweetCardProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;

  const handleAddToCart = () => {
    addToCart(sweet, quantity);
    toast.success(`Added ${quantity} ${sweet.name} to cart`);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (quantity < sweet.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {sweet.imageUrl ? (
          <img
            src={sweet.imageUrl}
            alt={sweet.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center gradient-pink">
            <Package className="h-16 w-16 text-primary/30" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {sweet.category}
          </Badge>
          {isOutOfStock && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Out of Stock
            </Badge>
          )}
          {isLowStock && (
            <Badge className="bg-warning text-warning-foreground flex items-center gap-1">
              Only {sweet.quantity} left
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
          {sweet.name}
        </h3>
        {sweet.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {sweet.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ₹{Number(sweet.price).toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">
            {sweet.quantity} in stock
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        {!isOutOfStock && (
          <div className="flex items-center justify-center gap-3 w-full">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={incrementQuantity}
              disabled={quantity >= sweet.quantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full gap-2 ${
            isOutOfStock
              ? 'bg-muted text-muted-foreground'
              : 'gradient-warm shadow-warm hover:opacity-90'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};
