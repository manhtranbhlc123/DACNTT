import React from 'react'
import sample from '../assets/sample.png'
import { Star } from 'lucide-react'
export const ProductCard = ({name, price, solded}) => {
  return (
    <div className="w-60 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={sample} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm text-gray-700 line-clamp-2 mb-2 font-medium">
          {name}
        </h3>
        <div className="flex items-baseline mb-2">
          <span className="text-lg font-bold text-red-600">{price}</span>
          <span className="text-xs text-red-600 font-semibold underline ml-0.5"> VND</span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <p className="truncate">Đã bán {solded}</p>
          <div className="flex items-center gap-1">
            <span>5</span>
            <Star size={16} color='#BA8E23'/>
          </div>
        </div>
      </div>
    </div>
  )
}

