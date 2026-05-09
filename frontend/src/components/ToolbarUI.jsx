import React from 'react';
import logo from '../assets/logoZig.png';
import { ChevronDown, User, Handbag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logout } from './Logout';

export const ToolbarUI = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const cartLink = user ? `/cart/${user._id}` : '/login';

  const sanPhamItems = [
    { label: 'Tất cả sản phẩm', link: '/allproduct' },
    { label: 'Sản phẩm mới', link: '/products?type=new' },
    { label: 'Sản phẩm nổi bật', link: '/products?type=hot' },
    { label: 'Sản phẩm sale', link: '/products?type=sale' },
  ];

  const theLoaiColumns = [
    { title: 'Kiểu dáng', items: ['Cổ cao', 'Cổ thấp', 'Cổ lửng', 'Không dây'] },
    { title: 'Thể thao', items: ['Bóng đá', 'Bóng rổ', 'Bóng chuyền', 'Chạy bộ', 'Cầu lông'] },
    { title: 'Đối tượng', items: ['Nam', 'Nữ', 'Trẻ em', 'Học sinh', 'Thanh niên'] },
    { title: 'Phụ kiện', items: ['Dây giày', 'Lót giày', 'Xịt khử mùi', 'Tất, vớ'] }
  ];

  const brands = [
    'Nike', 'Reebok', 'Onitsuka Tiger', 'Biti\'s', 'Li-Ning',
    'Adidas', 'Asics', 'Saucony', 'Ananas', 'Anta',
    'Puma', 'Fila', 'Hoka One One', 'RieNevan', 'Juno',
    'New Balance', 'Balenciaga', 'Diadora', 'SKEAN', 'MWC',
    'Converse', 'Under Armour', 'Mizuno', 'Vintas', 'Hồng Thạnh',
    'Vans', 'Skechers', 'Lacoste', 'Virgom', 'Smartmen'
  ];

  return (
    <div className='bg-gray-600 h-16 flex items-center flex-row px-48 justify-between relative z-50'>
      <div className="h-16 w-32 items-center flex">
          <Link to={'/'}>
            <img src={logo} alt="logo Zig" className='w-auto h-12 object-cover' />
          </Link>
      </div>
      <div className='flex items-center space-x-24 h-full'>
          <div className='flex items-center flex-row space-x-0.5 h-full'>
            <Link to={'/'}>
              <span className='text-white font-medium hover:text-gray-300'>TRANG CHỦ</span>
            </Link>
          </div>
          <div className='group relative flex items-center flex-row space-x-0.5 h-full cursor-pointer'>
            <span className='text-white font-medium group-hover:text-gray-300'>Sản phẩm</span>
            <ChevronDown size={16} className='text-white group-hover:text-gray-300' />
            <div className='hidden group-hover:block absolute top-full left-0 w-48 bg-white shadow-xl rounded-b-md py-2 z-50'>
              {sanPhamItems.map((item, idx) => (
                <Link key={idx} to={item.link} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500'>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className='group relative flex items-center flex-row space-x-0.5 h-full cursor-pointer'>
            <span className='text-white font-medium group-hover:text-gray-300'>Thể loại</span>
            <ChevronDown size={16} className='text-white group-hover:text-gray-300' />
            <div className='hidden group-hover:block absolute top-full -left-20 w-[600px] bg-white shadow-xl rounded-b-md p-6 z-50'>
               <div className="grid grid-cols-4 gap-6">
                  {theLoaiColumns.map((col, idx) => (
                    <div key={idx}>
                      <h4 className="font-bold text-gray-900 mb-2 uppercase text-xs border-b pb-1">{col.title}</h4>
                      <ul className="space-y-1">
                        {col.items.map((item, i) => (
                          <li key={i}>
                            <Link to={`/category/${item}`} className="text-sm text-gray-600 hover:text-red-500 block py-0.5">
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className='group relative flex items-center flex-row space-x-0.5 h-full cursor-pointer'>
            <span className='text-white font-medium group-hover:text-gray-300'>Thương hiệu</span>
            <ChevronDown size={16} className='text-white group-hover:text-gray-300' />
            <div className='hidden group-hover:block absolute top-full -left-32 w-[700px] bg-white shadow-xl rounded-b-md p-6 z-50'>
               <div className="grid grid-cols-5 gap-y-2 gap-x-4">
                  {brands.map((brand, idx) => (
                    <Link key={idx} to={`/brand/${brand}`} className="text-sm text-gray-600 hover:text-red-500 truncate block py-1">
                      {brand}
                    </Link>
                  ))}
               </div>
            </div>
          </div>

          <div className='bg-black rounded-full w-48 h-8 flex items-center justify-between px-2'>
            <input type="text" className='flex-1 w-24 bg-transparent border-none outline-none text-white text-sm' />
            <div className='w-6 flex justify-center'>
              <Search size={16} className='text-white'/>
            </div>
          </div>
      </div>

      <div className='flex items-center space-x-2'>
        <User className='text-white' size={32}/>
        <Link to={cartLink}>
          <Handbag className='text-white' size={32}/>
        </Link>
        <Logout/>
      </div>
    </div>
  )
}