'use client';

import { useStore, Product } from '@/lib/store';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';

export function ProductGrid() {
  const { products, categories, selectedCategory, setSelectedCategory, setSelectedProduct } = useStore();

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category?.slug === selectedCategory);

  // Filter out "all" from the category list for the buttons
  const displayCategories = categories.filter((c) => c.slug !== 'all');

  return (
    <div className="space-y-6">
      {/* Category Filter Buttons */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:border-blue-300 hover:text-blue-700'}
          >
            All Products
          </Button>
          {displayCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.slug)}
              className={selectedCategory === cat.slug ? 'bg-blue-600 hover:bg-blue-700' : 'hover:border-blue-300 hover:text-blue-700'}
            >
              {cat.name}
            </Button>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm">Try selecting a different category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={(p: Product) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
