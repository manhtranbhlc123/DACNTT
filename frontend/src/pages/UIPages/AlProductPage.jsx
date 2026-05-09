import React from 'react'
import { FooterUI } from '../../components/FooterUi'
import { HeaderUI } from '../../components/HeaderUI'
import { ToolbarUI } from '../../components/ToolbarUI'
import { NearFooter } from '../../components/NearFooter'
import { AllRooms } from '../../components/AllRooms' 

const AllRoomsPage = () => {
  return (
    <div className="bg-slate-50">
      <HeaderUI/>
      <ToolbarUI/>
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-6 mb-8">
            <h1 className="text-4xl font-black text-slate-900">Tất cả hạng phòng</h1>
            <p className="text-slate-500 mt-2">Tìm kiếm không gian nghỉ dưỡng phù hợp với nhu cầu của bạn</p>
        </div>
        <AllRooms/> {}
      </div>
      <NearFooter/>
      <FooterUI/>
    </div>
  )
}

export default AllRoomsPage;