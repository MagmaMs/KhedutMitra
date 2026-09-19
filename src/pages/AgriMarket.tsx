import React, { useState } from 'react';
import { Card, Input, Select, Notice, EmptyState } from '../components';
import { useLanguage } from '../hooks/useLanguage';
import { formatRupees } from '../utils/format';
import { Star, Search, Filter } from 'lucide-react';
import type { AgriProduct, ProductCategory } from '../types';
import { products as productData } from '../data/products';

const categories: Array<{ id: ProductCategory | 'All'; label: string }> = [
  { id: 'All', label: 'All' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'fertilizers', label: 'Fertilizers' },
  { id: 'pesticides', label: 'Pesticides' },
  { id: 'insecticides', label: 'Insecticides' },
  { id: 'tools', label: 'Tools' },
  { id: 'machinery', label: 'Machinery' },
  { id: 'irrigation', label: 'Irrigation' },
  { id: 'other', label: 'Other' },
];
const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export function AgriMarket() {
  const { t } = useLanguage();
  const [category, setCategory] = useState<ProductCategory | 'All'>('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');
  const [products, setProducts] = useState<AgriProduct[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    // Explicitly load the verified curated catalog
    setProducts(productData);
    setLoading(false);
  }, []);

  let filtered = products.filter((p) => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  filtered = filtered.sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t('agriMarket.title') || 'Agricultural Market'}
        </h1>
        <p className="mt-1 text-base text-ink-muted">
          {t('agriMarket.subtitle') || 'Find the best inputs and equipment for your farm'}
        </p>
      </div>

      <Notice tone="info" message="Demo catalog: Products and prices are illustrative." />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
          <Input 
            label="Search products"
            hideLabel
            className="pl-10" 
            placeholder={t('agriMarket.search') || 'Search products...'}
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select 
            label="Sort by"
            hideLabel
            value={sort}
            onChange={(e: any) => setSort(e.target.value)}
            options={sortOptions}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              category === c.id ? 'bg-brand text-white border border-brand' : 'bg-canvas text-ink border border-line hover:border-ink-muted/50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-4 h-64 animate-pulse bg-canvas/50" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((product: any, idx: number) => (
            <Card key={idx} className="p-4 flex flex-col">
              <div className="h-32 bg-canvas rounded-lg mb-4 flex items-center justify-center text-ink-muted">
                [Image: {product.name}]
              </div>
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-brand uppercase tracking-wider">{product.brand}</span>
                <div className="flex items-center text-accent">
                  <Star size={14} className="fill-current" />
                  <span className="ml-1 text-xs font-medium">{product.rating}</span>
                </div>
              </div>
              <h3 className="font-bold text-ink mb-1 truncate">{product.name}</h3>
              <p className="text-sm text-ink-muted mb-4">{product.unit}</p>
              
              <div className="mt-auto flex items-center justify-between">
                <p className="text-lg font-bold text-ink">{formatRupees ? formatRupees(product.price) : `₹${product.price}`}</p>
                {product.inStock ? (
                  <span className="px-2 py-1 bg-brand-soft text-brand text-xs font-bold rounded">In Stock</span>
                ) : (
                  <span className="px-2 py-1 bg-danger-soft text-danger text-xs font-bold rounded">Out of Stock</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No products found" 
          body="Try adjusting your filters or search terms." 
          icon={Filter}
        />
      )}
    </div>
  );
}
