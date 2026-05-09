import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { ProductCard } from './ProductCard'
import axios from 'axios'

export const AllProduct = () => {
  const [shoesList, setShoesList] = useState([]);
  const fetchShoes = () => {
    axios.get('http://localhost:5555/shoes')
      .then((response) => setShoesList(response.data.data))
      .catch((error) => console.log(error));
  }
  useEffect(() => {
    fetchShoes();
  }, []);

  

  const brands = ["Nike", "Jordan", "Adidas", "MLB", "New balance", "Converse", "Puma", "Reebook"];
  const prices = ["Dưới 500.000 đ", "500.000 đ - 1.000.000", "1.000.000 đ - 2.000.000 đ", "2.000.000 đ - 3.000.000 đ", "Trên 3.000.000 đ"];
  const types = ["Cổ cao", "Cổ thấp", "Cổ lửng", "Không dây", "Bóng đá", "Bóng rổ", "Bóng chuyền", "Chạy bộ", "Cầu lông"];
  const sizes = ["35", "35.5", "36", "36.5", "37", "37.5", "38", "38.5"];

  return (
    <div className="py-16 bg-white font-sans text-gray-800">
      <div className="flex justify-center my-8">
        <div className="bg-gray-800 text-white font-bold py-2 px-8 rounded-full text-lg uppercase tracking-wide">
          Tất cả sản phẩm
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 shrink-0 space-y-8">
            <FilterSection title="THƯƠNG HIỆU" items={brands} scrollable />
            <FilterSection title="LỌC GIÁ" items={prices} />
            <FilterSection title="THỂ LOẠI" items={types} scrollable scrollHeight="h-64" />
            <FilterSection title="KÍCH THƯỚC" items={sizes} scrollable />

          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {shoesList.map((shoe) => (
                <div key={shoe._id} className="relative group">
                  <Link to = {`/detail/${shoe._id}`}className="block h-full">
                    <ProductCard 
                        name={shoe.tenSanPham} 
                        price={shoe.giaBan} 
                        solded={shoe.soLuongDaBan} 
                    />
                  </Link>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-3 mt-12 mb-8">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-700 transition">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#D9534F] text-white font-bold shadow-md">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition text-gray-600">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition text-gray-600">
                3
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition text-gray-600">
                4
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-700 transition">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FilterSection = ({ title, items, scrollable = false, scrollHeight = "h-48" }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-bold text-sm text-gray-700 uppercase mb-3">{title}</h3>
      
      <div className={`${scrollable ? `${scrollHeight} overflow-y-auto pr-2 custom-scrollbar` : ''}`}>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <label key={idx} className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="mt-1 w-4 h-4 border-gray-300 rounded text-gray-800 focus:ring-gray-800"
              />
              <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

