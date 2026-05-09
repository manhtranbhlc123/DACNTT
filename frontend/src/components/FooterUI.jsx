import React from 'react'
import { MapPin,Phone,Mail,Instagram,Youtube,Facebook } from 'lucide-react'
export const FooterUI = () => {
  return (
    <div className='bg-gray-900 h-80 w-screen grid grid-cols-5 px-48 pt-8 space-x-4'>
      <div className='flex flex-col space-y-4 col-span-2'>
        <span className='text-2xl text-white'>Giới thiệu</span>
        <div className='flex flex-col space-y-3'>
          <span className='text-white'>Zig chuyên cung cấp các loại giày authentic từ các hãng Nike, Adidas, Puma, MLB...</span>
          <div>
            <div className='flex items-center space-x-2'>
              <MapPin className='text-white' size={24}/>
              <span className='text-white'>Số 1, Ngõ 1, Đường Khuất Duy Tiến, Quận Thanh Xuân, TP. Hà Nội</span>
            </div>
          </div>
          <div>
            <div className='flex items-center space-x-2'>
              <Phone className='text-white' size={24}/>
              <span className='text-white'>1900 1354</span>
            </div>
          </div>
          <div>
            <div className='flex items-center space-x-2'>
              <Mail className='text-white' size={24}/>
              <span className='text-white'>ecom@zigstore.vn</span>
            </div>
          </div>
          <span className='text-white'>Giấy chứng nhận Đăng ký Kinh doanh số 0454678746 do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp ngày 03/03/2023</span>
        </div>
      </div>

      <div className='flex flex-col space-y-4'>
        <span className='text-2xl text-white'>Hướng dẫn</span>
        <div className='flex flex-col space-y-3'>
          <span className='text-white'>Điều khoản và dịch vụ</span>
          <span className='text-white'>Hướng dẫn mua hàng</span>
          <span className='text-white'>Hướng dẫn kích cỡ</span>
          <span className='text-white'>Liên hệ</span>
        </div>
      </div>

      <div className='flex flex-col space-y-4'>
        <span className='text-2xl text-white'> Chính sách</span>
        <div className='flex flex-col space-y-3'>
          <span className='text-white'>Chính sách bảo hành</span>
          <span className='text-white'>Chính sách bảo mật</span>
          <span className='text-white'>Chính sách vận hành</span>
          <span className='text-white'>Chính sách đổi trả</span>
        </div>
      </div>

      <div className='flex flex-col space-y-4'>
        <span className='text-2xl text-white self-center'>Theo dõi chúng tôi</span>
        <div className='flex flex-col space-y-3'>
          <div className='flex items-center w-full justify-center space-x-10'>
            <Instagram size={36} className='text-white'/>
            <Facebook size={36} className='text-white'/>
            <Youtube size={36} className='text-white'/>
          </div>
        </div>
      </div>
    </div>
  )
}
