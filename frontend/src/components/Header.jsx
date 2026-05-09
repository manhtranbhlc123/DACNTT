import React from 'react'
import { Bell, LogOut } from 'lucide-react'
import logo from '../assets/logoZig.png';
export const Header = () => {
  return (
    <div className="bg-gray-900 text-white h-16 flex items-center justify-between px-6 shadow">
            <div className="h-16 w-32 items-center flex">
                <img src= {logo} alt="logo Zig" className='w-auto h-12 object-cover '/>
            </div>
            
            <div className="flex items-center space-x-4">
                 <Bell className="cursor-pointer hover:text-gray-300 " />
                 <LogOut className="cursor-pointer hover:text-gray-300" />
            </div>
        </div>
  )
}


