import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { ActionToolbar } from '../../components/ActionToolbar';
import { Next } from '../../components/Next';
import { DataTable } from '../../components/DataTable';
import { ActionModal } from '../../components/ActionModal';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
        const res = await axios.get('http://localhost:5555/bookings'); 
        setBookings(res.data.data);
    } catch (error) {
        console.error("Lỗi tải danh sách đặt phòng:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
        case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
        case 'Checked-in': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
        case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const modalFields = [
    { header: "Mã đặt phòng", accessor: "_id", type: "text", readOnly: true, className: "col-span-1" },
    { 
      header: "Khách hàng", 
      accessor: "user", 
      readOnly: true, 
      render: (d) => d.user?.username || "Khách ẩn danh" 
    },
    { header: "Số điện thoại", accessor: "phone", required: true },
    { 
      header: "Thông tin phòng", 
      accessor: "room", 
      readOnly: true,
      className: "col-span-2 font-bold text-blue-800",
      render: (d) => `${d.room?.name} (${d.room?.type})`
    },
    { 
      header: "Thời gian lưu trú", 
      accessor: "dates", 
      readOnly: true, 
      className: "col-span-2",
      render: (d) => `Từ: ${formatDate(d.checkInDate)} - Đến: ${formatDate(d.checkOutDate)}`
    },
    { header: "Số khách", accessor: "guests", type: "number", required: true },
    { 
      header: "Tổng tiền ($)", 
      accessor: "totalPrice", 
      readOnly: true, 
      className: "font-bold text-red-600",
      render: (d) => `$${Number(d.totalPrice).toLocaleString()}`
    },
    { 
        header: "Trạng thái", 
        accessor: "status", 
        type: "select",  
        options: [
            { value: "Pending", label: "Pending (Chờ xác nhận)" },
            { value: "Confirmed", label: "Confirmed (Đã xác nhận)" },
            { value: "Checked-in", label: "Checked-in (Đã nhận phòng)" },
            { value: "Completed", label: "Completed (Hoàn thành)" },
            { value: "Cancelled", label: "Cancelled (Đã hủy)" },
        ],
        required: true
    },
  ];

  const columns = [
    { header: "STT", render: (row, index) => index + 1, className: "w-12 text-center" },
    { 
      header: "Mã đơn", 
      accessor: "_id",
      render: (row) => <span className="uppercase text-[10px] font-bold">{row._id.slice(-6)}</span>
    },
    { 
      header: "Khách hàng", 
      render: (row) => (
        <div className="flex flex-col">
            <span className="font-bold text-sm">{row.user?.username || "Guest"}</span>
            <span className="text-[10px] text-gray-500">{row.phone}</span>
        </div>
      )
    },
    { 
        header: "Phòng", 
        render: (row) => <span className="text-sm font-medium">{row.room?.name}</span>
    },
    { 
        header: "Check-in/Out", 
        render: (row) => (
            <div className="text-[11px] leading-tight">
                <div className="text-green-600">In: {formatDate(row.checkInDate)}</div>
                <div className="text-red-600">Out: {formatDate(row.checkOutDate)}</div>
            </div>
        )
    },
    { 
      header: "Thanh toán", 
      render: (row) => <span className="font-bold text-red-600 text-sm">${Number(row.totalPrice).toLocaleString()}</span>
    },
    {
      header: "Trạng thái",
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusColor(row.status)}`}>
            {row.status}
        </span>
      )
    },
    {
      header: "Thao tác",
      className: "w-32 text-center",
      render: (row) => (
        <div className="flex justify-center gap-x-2"> 
          <button onClick={() => handleOpenModal('details', row)} className="p-1 hover:bg-blue-50 rounded">
            <BsInfoCircle className="text-lg text-blue-600" />
          </button> 
          <button onClick={() => handleOpenModal('edit', row)} className="p-1 hover:bg-yellow-50 rounded">
            <AiOutlineEdit className="text-lg text-yellow-600" />
          </button> 
          <button onClick={() => handleOpenModal('delete', row)} className="p-1 hover:bg-red-50 rounded">
            <MdOutlineDelete className="text-lg text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  const handleOpenModal = (type, booking = null) => {
    setModalType(type); 
    setSelectedBooking(booking ? JSON.parse(JSON.stringify(booking)) : null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (modalType === 'edit') { 
        await axios.put(`http://localhost:5555/bookings/${selectedBooking._id}`, formData);
        alert('Cập nhật lịch đặt phòng thành công!');
      }
      handleCloseModal();
      fetchBookings();  
    } catch (error) {
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async () => {
    if(!window.confirm("Xóa lịch đặt phòng này?")) return;
    try {
      await axios.delete(`http://localhost:5555/bookings/${selectedBooking._id}`);
      alert('Đã xóa lịch đặt!');
      handleCloseModal();
      fetchBookings();
    } catch (error) {
      alert('Lỗi khi xóa!');
    }
  };

  return (
    <div className='h-screen flex flex-col font-sans bg-gray-100'>
      <Header />
      <div className='flex flex-1 flex-row overflow-hidden'>
        <Sidebar />
        <div className='flex flex-col w-full h-full overflow-hidden'> 
          <ActionToolbar onAdd={() => alert("Chỉ khách hàng mới có thể đặt phòng!")} /> 
          
          <div className='flex-1 p-6 overflow-auto'>
             <div className="mb-4">
                <h2 className="text-2xl font-black text-gray-800">Quản lý Đặt phòng (Bookings)</h2>
                <p className="text-sm text-gray-500">Theo dõi trạng thái nhận phòng và thanh toán của khách hàng.</p>
             </div>
             {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                 </div>
             ) : (
                 <div className="bg-white rounded-[24px] shadow-sm border border-gray-200 overflow-hidden">
                    <DataTable columns={columns} data={bookings} />
                 </div>
             )}
          </div>
          <Next />
        </div>
      </div>

      <ActionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={
            modalType === 'edit' ? 'Cập nhật Trạng thái' : 
            modalType === 'details' ? 'Chi tiết Đặt phòng' : 'Xác nhận xóa'
        }
        type={modalType}
        fields={modalFields}          
        data={selectedBooking}       
        onSubmit={handleFormSubmit}   
        onDelete={handleDelete}       
      />
    </div>
  );
};

export default AdminBookings;