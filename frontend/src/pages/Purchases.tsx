import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { usePurchases } from '@/hooks/usePurchases';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

const Purchases = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: purchases, isLoading } = usePurchases(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Order History
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            My Purchases
          </h1>
          <p className="text-muted-foreground">
            View all your past sweet purchases
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !purchases || purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">
              No purchases yet
            </h3>
            <p className="mt-2 text-muted-foreground">
              Start shopping to see your order history here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase, index) => (
              <Card
                key={purchase.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {purchase.sweet?.image_url ? (
                      <img
                        src={purchase.sweet.image_url}
                        alt={purchase.sweet.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {purchase.sweet?.name || 'Unknown Sweet'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(purchase.created_at), 'PPP p')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        ₹{Number(purchase.price_at_purchase).toFixed(2)}
                      </p>
                      <Badge variant="secondary">Qty: {purchase.quantity}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Purchases</span>
                <span className="font-bold text-lg text-foreground">
                  ₹{purchases.reduce((sum, p) => sum + Number(p.price_at_purchase) * p.quantity, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Purchases;
