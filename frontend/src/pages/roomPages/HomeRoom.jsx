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

const AdminRooms = () => {
  const [roomsList, setRoomsList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  // 1. Cấu hình các trường dữ liệu cho Phòng khách sạn
  const modalFields = [
    { 
      header: "Tên phòng", 
      accessor: "name", 
      required: true, 
      className: "col-span-2",
      placeholder: "Ví dụ: Phòng Deluxe Hướng Biển"
    },
    { header: "Giá mỗi đêm ($)", accessor: "pricePerNight", type: "number", required: true },
    { header: "Sức chứa (người)", accessor: "capacity", type: "number", required: true },
    { header: "Diện tích (m2)", accessor: "area", type: "number", required: true },
    { header: "Loại phòng", accessor: "type", required: true, placeholder: "Single, Double, Suite..." },
    { 
      header: "Tình trạng", 
      accessor: "status", 
      type: "select",
      options: [
        { value: "Available", label: "Còn trống" },
        { value: "Booked", label: "Đã đặt" },
        { value: "Maintenance", label: "Đang sửa chữa" }
      ],
      defaultValue: "Available" 
    },
    { 
      header: "Hình ảnh (URL)", 
      accessor: "image", 
      required: true, 
      className: "col-span-2" 
    },
    { 
      header: "Mô tả phòng", 
      accessor: "description", 
      required: true, 
      className: "col-span-2",
      placeholder: "Mô tả các tiện nghi: Wifi, Bồn tắm, Ban công..." 
    },
  ];

  // 2. Cấu hình các cột hiển thị trong bảng danh sách
  const columns = [
    { header: "STT", render: (row, index) => index + 1, className: "w-12" },
    { 
      header: "Ảnh", 
      accessor: "image",
      render: (row) => <img src={row.image} alt="room" className="w-16 h-12 object-cover rounded-lg" />
    },
    { header: "Tên phòng", accessor: "name", className: "font-medium" },
    { 
      header: "Giá/Đêm", 
      accessor: "pricePerNight", 
      render: (row) => `$${row.pricePerNight?.toLocaleString()}` 
    },
    { header: "Loại", accessor: "type", className: "text-center" },
    { 
      header: "Tình trạng", 
      accessor: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
          row.status === 'Available' ? 'bg-green-100 text-green-700' : 
          row.status === 'Booked' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
        }`}>
          {row.status === 'Available' ? 'Còn trống' : row.status === 'Booked' ? 'Đã đặt' : 'Bảo trì'}
        </span>
      )
    },
    {
      header: "Thao tác",
      className: "w-48",
      render: (row) => (
        <div className="flex justify-center gap-x-4">
          <button onClick={() => handleOpenModal('details', row)}>
            <BsInfoCircle className="text-xl text-blue-600" title="Chi tiết" />
          </button>
          <button onClick={() => handleOpenModal('edit', row)}>
            <AiOutlineEdit className="text-xl text-yellow-600" title="Sửa" />
          </button>
          <button onClick={() => handleOpenModal('delete', row)}>
            <MdOutlineDelete className="text-xl text-red-600" title="Xóa" />
          </button>
        </div>
      ),
    },
  ];

  // 3. API calls (Thay đổi đường dẫn API sang /rooms)
  const fetchRooms = () => {
    axios.get('http://localhost:5555/rooms') 
      .then((response) => setRoomsList(response.data.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleOpenModal = (type, room = null) => {
    setModalType(type);
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRoom(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (modalType === 'create') {
        await axios.post('http://localhost:5555/rooms', formData);
        alert('Thêm phòng thành công!');
      } else if (modalType === 'edit') {
        await axios.put(`http://localhost:5555/rooms/${selectedRoom._id}`, formData);
        alert('Cập nhật thành công!');
      }
      handleCloseModal();
      fetchRooms();
    } catch (error) {
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5555/rooms/${selectedRoom._id}`);
      alert('Đã xóa phòng!');
      handleCloseModal();
      fetchRooms();
    } catch (error) {
      alert('Lỗi khi xóa!');
    }
  };

  return (
    <div className='h-screen flex flex-col bg-white font-sans'>
      <Header />
      <div className='flex flex-1 flex-row overflow-hidden'>
        <Sidebar />
        <div className='flex flex-col w-full h-full overflow-hidden'>
          <ActionToolbar onAdd={() => handleOpenModal('create')} />
          
          <div className='bg-gray-50 flex-1 p-6 overflow-auto'>
            <div className="mb-4">
                <h1 className="text-2xl font-black text-gray-800">Quản lý phòng khách sạn</h1>
                <p className="text-gray-500 text-sm">Thêm, sửa, xóa hoặc cập nhật trạng thái các phòng trong hệ thống.</p>
            </div>
            <DataTable columns={columns} data={roomsList} />
          </div>
          <Next />
        </div>
      </div>

      <ActionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={
            modalType === 'create' ? 'Thêm phòng mới' : 
            modalType === 'edit' ? 'Chỉnh sửa phòng' : 
            modalType === 'details' ? 'Thông tin chi tiết phòng' : 'Xác nhận xóa phòng'
        }
        type={modalType}
        fields={modalFields}          
        data={selectedRoom}       
        onSubmit={handleFormSubmit}   
        onDelete={handleDelete}       
      />
    </div>
  );
};

export default AdminRooms;