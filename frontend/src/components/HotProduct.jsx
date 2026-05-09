import React from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard'; 
import sample from '../assets/sample.png';
export const HotProduct = ({title}) => {
  const products = [
    {
      id: 1,
      name: 'Puma Speedcat OG',
      price: 2500000,
      sold: '10k+',
      rating: 5.0,
      image: sample
    },
    {
      id: 2,
      name: 'Adidas Womens Galaxy 6',
      price: 2500000,
      discount: null,
      sold: '10k+',
      rating: 5.0,
      image: sample
    },
    {
      id: 3,
      name: 'New balance 550',
      price: 2500000,
      oldPrice: 2600000,
      discount: null,
      sold: '10k+',
      rating: 5.0,
      image: sample
    },
    {
      id: 4,
      name: "Nike Blazer Mid '77 Vintage",
      price: 2500000,
      oldPrice: 2600000,
      discount: null,
      sold: '10k+',
      rating: 5.0,
      image: sample
    },
  ];

  return (
    <div className="bg-white  font-sans overflow-hidden">
      <div className="container mx-auto px-4 md:px-24 py-16 space-y-16 max-w-7xl">
        <div>
          <div className="flex justify-between items-center mb-8">
             <div className="bg-[#2D2D2D] text-white font-bold py-2.5 px-6 rounded-full uppercase text-sm shadow-md tracking-wide">
                {title}
             </div>
             <Link to="/products?type=new" className="w-8 h-8 flex items-center justify-center bg-[#FF4D4F] rounded-full text-white hover:bg-red-700 transition shadow-md shadow-red-200">
                <ArrowRight size={16} />
             </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
             {products.map((product, index) => (
               <ProductCard key={`new-${index}`} name={product.name} price={product.price} solded={product.sold} />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};