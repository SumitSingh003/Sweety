import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePurchaseSweet } from '@/hooks/useSweets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const purchaseMutation = usePurchaseSweet();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsPurchasing(true);
    
    try {
      for (const item of items) {
        await purchaseMutation.mutateAsync({
          sweetId: item.sweet.id,
          quantity: item.quantity,
        });
      }
      clearCart();
      toast.success('Purchase successful! Check your purchase history.');
      navigate('/purchases');
    } catch (error) {
      toast.error('Some items could not be purchased. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full gradient-pink">
              <ShoppingBag className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any sweets yet. Browse our collection!
            </p>
            <Button asChild className="gradient-warm shadow-warm">
              <Link to="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.sweet.id} className="overflow-hidden">
                <div className="flex gap-4 p-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.sweet.imageUrl ? (
                      <img
                        src={item.sweet.imageUrl}
                        alt={item.sweet.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center gradient-pink">
                        <ShoppingBag className="h-8 w-8 text-primary/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg font-semibold">
                        {item.sweet.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.sweet.category}
                      </p>
                      <p className="text-primary font-bold mt-1">
                        ₹{Number(item.sweet.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.sweet.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.sweet.id, item.quantity + 1)}
                          disabled={item.quantity >= item.sweet.quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({item.sweet.quantity} available)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.sweet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-display">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.sweet.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.sweet.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{(Number(item.sweet.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button
                  className="w-full gradient-warm shadow-warm"
                  onClick={handleCheckout}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? 'Processing...' : 'Checkout'}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/shop">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
