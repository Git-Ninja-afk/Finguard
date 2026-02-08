
import React, { useState } from 'react';
import { Search, ShoppingCart, Star } from 'lucide-react';
import { MOCK_MARKETPLACE, COLORS } from '../constants';

const Marketplace: React.FC = () => {
  const [filter, setFilter] = useState('ALL');
  
  const categories = ['ALL', 'FEED', 'MEDICINE', 'EQUIPMENT', 'SEEDS'];

  const filteredItems = filter === 'ALL' 
    ? MOCK_MARKETPLACE 
    : MOCK_MARKETPLACE.filter(item => item.category === filter);

  return (
    <div className="pb-24">
      {/* Search Header */}
      <div className="bg-white p-4 space-y-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search feed, medicines..." 
              className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-blue-600 text-white p-2.5 rounded-xl active:scale-95 transition-transform">
            <ShoppingCart size={20} />
          </button>
        </div>

        {/* Categories Scroller */}
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === cat 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid - Refined to match screenshot exactly */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col group active:scale-[0.98] transition-transform">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide">
                  {item.category}
                </span>
                <div className="flex items-center text-yellow-500 space-x-1">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold text-gray-600">{item.rating}</span>
                </div>
              </div>
              
              <h3 className="text-sm font-bold text-gray-800 line-clamp-1 leading-tight mb-3">
                {item.name}
              </h3>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-black text-gray-900">₹{item.price}</span>
                <button className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 active:scale-90 transition-all shadow-lg shadow-blue-100">
                  <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Offers Section */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-6 text-white overflow-hidden relative shadow-xl shadow-blue-100">
          <div className="relative z-10">
            <h2 className="text-lg font-bold">Bulk Purchase Program</h2>
            <p className="text-xs opacity-90 mt-1 max-w-[200px]">
              Group with nearby farmers to save up to 25% on feeds & seeds.
            </p>
            <button className="mt-4 bg-white text-blue-700 px-5 py-2.5 rounded-2xl text-xs font-black shadow-lg">
              Join Group Buy
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 right-10 w-24 h-24 bg-blue-400/20 rounded-full -mb-12 blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
