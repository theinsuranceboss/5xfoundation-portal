'use client';

import { useStore, Product } from '@/lib/store';
import { ProductCard } from './product-card';

export function ProductGrid() {
  const { products, categories, selectedCategory, setSelectedCategory, setSelectedProduct } = useStore();

  const filteredProducts = (selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category?.slug === selectedCategory)
  ).filter((p) => p.category?.slug !== 'donations');

  // Filter out "all" and "donations" from the category list for the buttons
  const displayCategories = categories.filter((c) => c.slug !== 'all' && c.slug !== 'donations');

  return (
    <div className="space-y-8">
      {/* Category Filter Buttons */}
      <div className="space-y-4">
        <div className="inline-flex flex-wrap items-center gap-1.5 bg-gray-50/80 hover:bg-gray-50 border border-gray-200/60 p-2 rounded-2xl md:rounded-full shadow-sm transition-colors duration-200 backdrop-blur-sm">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2.5 rounded-xl md:rounded-full text-sm font-bold tracking-tight transition-all duration-300 select-none ${
              selectedCategory === 'all'
                ? 'bg-black text-white shadow-md hover:bg-gray-800'
                : 'text-gray-500 hover:text-black hover:bg-gray-200/50 bg-transparent'
            }`}
          >
            All Products
          </button>
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-6 py-2.5 rounded-xl md:rounded-full text-sm font-bold tracking-tight transition-all duration-300 select-none ${
                selectedCategory === cat.slug
                  ? 'bg-black text-white shadow-md hover:bg-gray-800'
                  : 'text-gray-500 hover:text-black hover:bg-gray-200/50 bg-transparent'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-400 font-medium tracking-wide">
          Showing <span className="font-bold text-black">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
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
