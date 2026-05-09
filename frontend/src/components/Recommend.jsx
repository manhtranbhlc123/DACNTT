import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard'; 

export const Recommend = () => {
  const relatedList = [
    {
      id: 1,
      name: "Giày Converse Chuck Taylor All Star Move",
      price: 1750000,
      solded: "10k+",
      discount: "-24%"
    },
    {
      id: 2,
      name: "Giày New Balance 530 Retro Running Navy",
      price: 2400000,
      solded: "10k+",
      discount: "-17%"
    },
    {
      id: 3,
      name: "Giày New Balance 574 'Beige Off White'",
      price: 1990000,
      solded: "10k+",
      discount: null
    }
  ];

  return (
    <div className="w-full bg-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-0.5 bg-gray-300 flex-1"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 uppercase text-center shrink-0 px-4">
            Sản phẩm liên quan
          </h2>
          <div className="h-0.5 bg-gray-300 flex-1"></div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button className="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <ChevronLeft size={48} strokeWidth={2.5} className="text-black" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {relatedList.map((item) => (
              <div key={item.id} className="relative group">
                {item.discount && (
                  <div className="absolute top-2 right-2 z-10 bg-[#E94E55] text-white text-xs font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-md">
                    {item.discount}
                  </div>
                )}
                <ProductCard 
                  name={item.name}
                  price={item.price}
                  solded={item.solded}
                />
              </div>
            ))}
          </div>
          <button className="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <ChevronRight size={48} strokeWidth={2.5} className="text-black" />
          </button>

        </div>
      </div>
    </div>
  );
};
