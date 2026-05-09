import React from 'react'
import { FooterUI } from '../../components/FooterUi'
import { HeaderUI } from '../../components/HeaderUI'
import { ToolbarUI } from '../../components/ToolbarUI'
import { NearFooter } from '../../components/NearFooter'
import heroBanner from '../../assets/hotel_banner.png' 
import { HotRooms } from '../../components/HotRooms' 
import { SearchBar } from '../../components/SearchBar' 

const HomePage = () => {
  return (
    <div>
      <HeaderUI/>
      <ToolbarUI/>
      {/* Phần Hero với bộ lọc tìm kiếm phòng */}
      <div className="relative">
        <img src={heroBanner} className='w-full h-120 object-cover brightness-75'/>
        <div className="absolute inset-0 flex items-center justify-center">
             <SearchBar /> {/* Component nhập Check-in, Check-out */}
        </div>
      </div>
      
      <HotRooms title="Phòng Suite Sang Trọng"/>
      <HotRooms title="Ưu Đãi Đặc Biệt"/>
      
      <NearFooter/>
      <FooterUI/>
    </div>
  )
}

export default HomePage