import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Calendar, CreditCard, MapPin, Bed } from 'lucide-react' // Thêm icon cho sinh động

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/bookings/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Tùy vào cấu trúc API của bạn, có thể là res.data hoặc res.data.bookings
        setBookings(res.data.bookings || res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đặt phòng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Đang tải danh sách chuyến đi...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-gray-900">Chuyến đi của tôi</h2>
        <p className="text-gray-500 mt-2">Quản lý các phòng bạn đã đặt tại Thăng Long Stay</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-[32px] text-center shadow-sm border border-dashed border-gray-300">
          <p className="text-gray-500">Bạn chưa có chuyến đi nào. Khám phá các phòng ngay!</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white p-2 rounded-[32px] border border-gray-100 flex flex-col md:flex-row gap-6 shadow-md hover:shadow-lg transition-shadow">
              {/* Hình ảnh phòng */}
              <div className="relative">
                <img 
                  src={booking.room?.image || 'https://via.placeholder.com/300x200'} 
                  className="w-full md:w-64 h-48 md:h-full rounded-[28px] object-cover" 
                  alt={booking.room?.name}
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                    booking.isPaid ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {booking.isPaid ? 'Đã xác nhận' : 'Chờ thanh toán'}
                  </span>
                </div>
              </div>

              {/* Thông tin chi tiết */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-2xl text-gray-800 mb-2">{booking.room?.name}</h3>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Tổng thanh toán</p>
                      <p className="text-2xl font-black text-blue-600">${booking.totalPrice}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium">
                        {new Date(booking.checkInDate).toLocaleDateString('vi-VN')} - {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Bed className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium">Loại phòng: Standard King</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-50 flex flex-wrap gap-3">
                   <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors">
                      Xem chi tiết
                   </button>
                   {!booking.isPaid && (
                     <button className="px-6 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-sm font-bold hover:bg-blue-100 transition-colors">
                        Thanh toán ngay
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookingsPage;