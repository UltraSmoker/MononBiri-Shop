import React from 'react';
import { Search, X, Heart } from 'lucide-react';

export interface FilterState {
  searchQuery: string;
  category: string;
  strength: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  onlyWishlist: boolean;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalResults: number;
  wishlistCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  totalResults,
  wishlistCount,
}) => {
  const categories = [
    { id: 'all', label: 'সকল সংস্করণ' },
    { id: 'modern_filter', label: 'আধুনিক ফিল্টার' },
    { id: 'traditional_tendu', label: 'ঐতিহ্যবাহী তেন্দুপাতা' },
    { id: 'special_edition', label: 'সংগ্রাহক ও বিশেষ' },
  ];

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.category !== 'all' ||
    filters.strength !== 'all' ||
    filters.sortBy !== 'featured' ||
    filters.onlyWishlist;

  return (
    <div className="bg-stone-900/70 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="bidi-search-input"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="বিড়ির নাম, গোল্ড ফিল্টার, মিন্ট, আমসত্ত্ব বা আইনস্টাইন লিখে খুঁজুন..."
            className="w-full bg-stone-950 border border-stone-800 text-stone-100 pl-10 pr-10 py-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-stone-500"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Strength, Sort & Saved Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filters.strength}
            onChange={(e) => onFilterChange({ ...filters, strength: e.target.value })}
            aria-label="Filter by strength"
            className="bg-stone-950 border border-stone-800 text-stone-200 text-xs sm:text-sm py-2.5 px-3 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">সব তীব্রতা (১–৫)</option>
            <option value="mild">মৃদু ও স্মুথ (১–২)</option>
            <option value="medium">সুষম মাঝারি (৩)</option>
            <option value="strong">কড়া ও চরম (৪–৫)</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
            }
            aria-label="Sort products"
            className="bg-stone-950 border border-stone-800 text-stone-200 text-xs sm:text-sm py-2.5 px-3 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="featured">নির্বাচিত ক্রম</option>
            <option value="rating">সর্বোচ্চ রেটিং</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
          </select>

          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, onlyWishlist: !filters.onlyWishlist })}
            className={`inline-flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2.5 rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
              filters.onlyWishlist
                ? 'bg-amber-600/20 border-amber-500 text-amber-300 font-semibold'
                : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filters.onlyWishlist ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>পছন্দের ({wishlistCount})</span>
          </button>

          {isFiltered && (
            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  searchQuery: '',
                  category: 'all',
                  strength: 'all',
                  sortBy: 'featured',
                  onlyWishlist: false,
                })
              }
              className="text-xs px-3 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              রিসেট
            </button>
          )}
        </div>
      </div>

      {/* Category Segmented Controls + Result Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800/80">
        <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800/80">
          {categories.map((cat) => {
            const isActive = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange({ ...filters, category: cat.id })}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-600 text-stone-950 font-bold'
                    : 'text-stone-300 hover:text-stone-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-stone-400 font-mono tabular-nums">
          মোট <strong className="text-stone-200">{totalResults}</strong> টি সংস্করণ
        </div>
      </div>
    </div>
  );
};
