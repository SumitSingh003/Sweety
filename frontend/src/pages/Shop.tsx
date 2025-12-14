import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SweetGrid } from '@/components/sweets/SweetGrid';
import { SearchFilter } from '@/components/sweets/SearchFilter';
import { useSweets, useCategories } from '@/hooks/useSweets';
import { Candy } from 'lucide-react';

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: sweets, isLoading } = useSweets(searchQuery, categoryFilter);
  const { data: categories = [] } = useCategories();

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Candy className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Sweet Collection
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Delicious Sweets
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our handcrafted selection of chocolates, candies, cookies, and more. 
            Each treat is made with love and the finest ingredients.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />
        </div>

        {/* Results count */}
        {sweets && sweets.length > 0 && (
          <p className="text-sm text-muted-foreground mb-6">
            Showing {sweets.length} sweet{sweets.length !== 1 ? 's' : ''}
            {categoryFilter !== 'all' && ` in ${categoryFilter}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        )}

        {/* Sweet Grid */}
        <SweetGrid sweets={sweets} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default Shop;
