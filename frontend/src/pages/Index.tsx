import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Cake, ShoppingBag, Shield, Sparkles } from 'lucide-react';

const Index = () => {
  const { user, isAdmin } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Welcome to Sweet Shop
            </div>
            <h1 className="mb-6 font-display text-5xl font-bold tracking-tight text-foreground lg:text-7xl">
              Delicious Treats,{' '}
              <span className="text-primary">Made with Love</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
              Discover our handcrafted selection of brownies, cupcakes, pastries, and more. 
              Every bite is a moment of pure sweetness.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link to="/shop">
                  <ShoppingBag className="h-5 w-5" />
                  Browse Sweets
                </Link>
              </Button>
              {!user && (
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
              {isAdmin && (
                <Button asChild variant="secondary" size="lg" className="gap-2">
                  <Link to="/admin">
                    <Shield className="h-5 w-5" />
                    Admin Panel
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-card/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Cake className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fresh Daily</h3>
              <p className="text-muted-foreground">
                All our sweets are baked fresh every morning using premium ingredients.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/20">
                <ShoppingBag className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Easy Ordering</h3>
              <p className="text-muted-foreground">
                Browse our selection and purchase your favorites with just a click.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/30">
                <Sparkles className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Handcrafted</h3>
              <p className="text-muted-foreground">
                Each treat is lovingly made by hand with attention to every detail.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
