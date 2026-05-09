import React, { useEffect, useState } from 'react';
import { Calendar, Users, Star, Bed } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();  
  const [room, setRoom] = useState(null); 
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    // Gọi API lấy chi tiết phòng
    axios.get(`http://localhost:5000/api/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleBooking = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert("Vui lòng đăng nhập để đặt phòng!");
        navigate('/login'); return;
    }

    if (!dates.checkIn || !dates.checkOut) {
        alert("Vui lòng chọn thời gian lưu trú!"); return;
    }

    setIsBooking(true);
    try {
        const payload = {
            user: user._id,
            room: room._id,
            hotel: room.hotelId, // ID khách sạn từ model room
            checkInDate: dates.checkIn,
            checkOutDate: dates.checkOut,
            guests: guests,
            totalPrice: room.pricePerNight * calculateDays(dates.checkIn, dates.checkOut),
            paymentMethod: "Stripe"
        };
        
        const response = await axios.post('http://localhost:5000/api/bookings/book', payload);
        if(response.data.success) {
            navigate(`/checkout/${response.data.booking._id}`);
        }
    } catch (error) {
        alert("Phòng đã được đặt trong thời gian này!");
    } finally { setIsBooking(false); }
  };

  if (!room) return <div>Đang tải...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-10 mt-20">
      <div className="flex-1">
        <img src={room.image} className="rounded-3xl shadow-2xl w-full h-[500px] object-cover" />
      </div>
      
      <div className="w-full md:w-96 space-y-6">
        <h1 className="text-4xl font-black">{room.name}</h1>
        <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Bed size={20}/> <span>{room.type}</span>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-500 uppercase">Ngày nhận & trả</label>
            <input type="date" className="border p-3 rounded-xl w-full" onChange={(e) => setDates({...dates, checkIn: e.target.value})} />
            <input type="date" className="border p-3 rounded-xl w-full" onChange={(e) => setDates({...dates, checkOut: e.target.value})} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-500 uppercase">Số khách</label>
            <input type="number" min="1" className="border p-3 rounded-xl" value={guests} onChange={(e) => setGuests(e.target.value)} />
          </div>

          <button 
            onClick={handleBooking}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            {isBooking ? "Đang xử lý..." : `Đặt Ngay - $${room.pricePerNight}/đêm`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomDetailPage;