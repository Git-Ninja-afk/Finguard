
import React from 'react';
import { MapPin, Navigation, Snowflake, ShieldCheck, Phone } from 'lucide-react';
import { MOCK_COLD_STORAGE, COLORS } from '../constants';

const ColdStorageScreen: React.FC = () => {
  return (
    <div className="pb-24">
      {/* Map Header (Simulated) */}
      <div className="h-64 bg-gray-200 w-full relative">
        <img 
          src="https://picsum.photos/seed/map/800/600" 
          alt="Map" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-blue-900/10"></div>
        
        {/* Map Markers (Simulated) */}
        <div className="absolute top-1/2 left-1/3 bg-blue-600 p-2 rounded-full border-2 border-white shadow-lg animate-bounce">
          <Snowflake size={16} className="text-white" />
        </div>
        <div className="absolute top-1/4 right-1/4 bg-blue-600 p-2 rounded-full border-2 border-white shadow-lg">
          <Snowflake size={16} className="text-white" />
        </div>

        {/* Floating Search Bar */}
        <div className="absolute top-4 left-4 right-4 bg-white rounded-2xl p-3 shadow-xl flex items-center space-x-3 border border-gray-100">
          <MapPin className="text-red-500" size={20} />
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Your Location</p>
            <p className="text-sm font-bold text-gray-800 line-clamp-1">Canning Town, West Bengal</p>
          </div>
          <button className="bg-gray-100 p-2 rounded-xl">
            <Navigation size={18} className="text-blue-600" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-6 relative z-10">
        <div className="flex justify-between items-end bg-white/80 backdrop-blur p-4 rounded-2xl shadow-sm border border-white">
          <h2 className="text-lg font-black text-gray-800">Nearby Facilities</h2>
          <span className="text-xs text-blue-600 font-bold">Filter By Type</span>
        </div>

        {MOCK_COLD_STORAGE.map((facility) => (
          <div key={facility.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
            <div className="relative h-40 md:w-1/3">
              <img src={facility.image} alt={facility.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center space-x-1">
                <MapPin size={10} className="text-blue-600" />
                <span className="text-[10px] font-bold text-gray-800">{facility.distance}</span>
              </div>
            </div>
            <div className="p-4 flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{facility.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold uppercase">
                      FSSAI Certified
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">
                      {facility.capacity} Available
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Starts from</p>
                  <p className="text-lg font-black text-blue-600">₹{facility.pricePerDay}<span className="text-xs font-normal">/MT/day</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
                <button className="flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50">
                  <Phone size={14} />
                  <span>Call Now</span>
                </button>
                <button className="bg-blue-600 text-white flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-200">
                  <span>Book Storage</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColdStorageScreen;
