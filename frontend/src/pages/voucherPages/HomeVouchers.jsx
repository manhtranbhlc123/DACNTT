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

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // 1. Cấu hình các trường dữ liệu ưu đãi cho Khách sạn
  const modalFields = [
    { 
      header: "Mã ưu đãi", 
      accessor: "code", 
      required: true, 
      placeholder: "VD: STAYHOME, SUMMER2026...",
      className: "col-span-1"
    },
    { 
      header: "Loại giảm giá", 
      accessor: "discountType", 
      type: "select", 
      required: true,
      options: [
        { value: "Percentage", label: "Giảm theo %" },
        { value: "Fixed", label: "Giảm số tiền cố định ($)" }
      ],
      defaultValue: "Percentage"
    },
    { 
      header: "Giá trị giảm", 
      accessor: "discountValue", 
      type: "number", 
      required: true, 
      placeholder: "VD: 10 (cho 10%) hoặc 50 (cho $50)"
    },
    { 
      header: "Giới hạn sử dụng", 
      accessor: "usageLimit", 
      type: "number", 
      required: true,
      placeholder: "Số lượng mã phát hành"
    },
    { 
        header: "Đã sử dụng", 
        accessor: "usedCount", 
        type: "number", 
        defaultValue: 0,
        readOnly: true, // Thường Admin không tự sửa số lượng đã dùng
        render: (d) => d.usedCount || 0
    },
    { header: "Ngày kích hoạt", accessor: "startDate", type: "date", required: true },
    { header: "Ngày hết hạn", accessor: "endDate", type: "date", required: true },
    { 
      header: "Trạng thái", 
      accessor: "status", 
      type: "select",
      options: [
        { value: "Active", label: "Đang áp dụng" },
        { value: "Expired", label: "Đã hết hạn" },
        { value: "Disabled", label: "Tạm dừng" }
      ],
      defaultValue: "Active",
      className: "col-span-2"
    },
  ];

  // 2. Cấu hình các cột hiển thị trong bảng
  const columns = [
    { header: "No.", render: (row, index) => index + 1, className: "w-12" },
    { header: "Mã Ưu Đãi", accessor: "code", className: "font-black text-blue-700 uppercase" },
    { 
      header: "Mức Giảm", 
      accessor: "discountValue",
      render: (row) => {
        if (row.discountType === 'Percentage') {
          return <span className="font-bold text-orange-600">-{row.discountValue}%</span>;
        }
        return <span className="font-bold text-green-600">-${Number(row.discountValue).toLocaleString()}</span>;
      }
    },
    { 
        header: "Lượt dùng", 
        className: "text-center",
        render: (row) => (
            <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-700">{row.usedCount || 0} / {row.usageLimit}</span>
                <div className="w-16 bg-gray-200 h-1 rounded-full mt-1 overflow-hidden">
                    <div 
                        className="bg-blue-500 h-full" 
                        style={{ width: `${Math.min(((row.usedCount || 0) / row.usageLimit) * 100, 100)}%` }}
                    ></div>
                </div>
            </div>
        )
    },
    { 
      header: "Hạn dùng", 
      accessor: "endDate",
      render: (row) => row.endDate ? new Date(row.endDate).toLocaleDateString('vi-VN') : 'Vô thời hạn'
    },
    { 
      header: "Trạng thái", 
      accessor: "status",
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
          row.status === 'Active' ? 'bg-green-100 text-green-700' : 
          row.status === 'Expired' ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-700'
        }`}>
          {row.status === 'Active' ? 'Đang chạy' : row.status === 'Expired' ? 'Hết hạn' : 'Đã khóa'}
        </span>
      )
    },
    {
      header: "Thao tác",
      className: "w-40 text-center",
      render: (row) => (
        <div className="flex justify-center gap-x-3">
          <button onClick={() => handleOpenModal('details', row)} className="hover:scale-110 transition-transform">
            <BsInfoCircle className="text-xl text-blue-600" />
          </button>
          <button onClick={() => handleOpenModal('edit', row)} className="hover:scale-110 transition-transform">
            <AiOutlineEdit className="text-xl text-yellow-600" />
          </button>
          <button onClick={() => handleOpenModal('delete', row)} className="hover:scale-110 transition-transform">
            <MdOutlineDelete className="text-xl text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  // --- API CALLS ---
  const fetchVouchers = () => {
    axios.get('http://localhost:5555/vouchers') 
      .then((response) => setVouchers(response.data.data))
      .catch((error) => console.log("Lỗi tải voucher:", error));
  };

  useEffect(() => { fetchVouchers(); }, []);

  const handleOpenModal = (type, voucher = null) => {
    setModalType(type);
    setSelectedVoucher(voucher);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVoucher(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (modalType === 'create') {
        await axios.post('http://localhost:5555/vouchers', formData);
        alert('Tạo mã giảm giá thành công!');
      } else if (modalType === 'edit') {
        await axios.put(`http://localhost:5555/vouchers/${selectedVoucher._id}`, formData);
        alert('Cập nhật thành công!');
      }
      handleCloseModal();
      fetchVouchers();
    } catch (error) {
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async () => {
    if(!window.confirm("Bạn muốn xóa mã giảm giá này?")) return;
    try {
      await axios.delete(`http://localhost:5555/vouchers/${selectedVoucher._id}`);
      alert('Đã xóa voucher!');
      handleCloseModal();
      fetchVouchers();
    } catch (error) {
      alert('Lỗi khi xóa!');
    }
  };

  return (
    <div className='h-screen flex flex-col bg-gray-50 font-sans'>
      <Header />
      <div className='flex flex-1 flex-row overflow-hidden'>
        <Sidebar />
        <div className='flex flex-col w-full h-full overflow-hidden'>
          <ActionToolbar onAdd={() => handleOpenModal('create')} />
          
          <div className='flex-1 p-6 overflow-auto'>
            <div className="mb-6">
                <h1 className="text-3xl font-black text-gray-800">Quản lý Ưu đãi</h1>
                <p className="text-gray-500">Tạo mã giảm giá cho khách hàng đặt phòng tại Thăng Long Stay.</p>
            </div>
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                <DataTable columns={columns} data={vouchers} />
            </div>
          </div>
          <Next />
        </div>
      </div>

      <ActionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={
            modalType === 'create' ? 'Tạo chương trình giảm giá' : 
            modalType === 'edit' ? 'Cập nhật mã ưu đãi' : 
            modalType === 'details' ? 'Chi tiết chương trình' : 'Xác nhận xóa'
        }
        type={modalType}
        fields={modalFields}          
        data={selectedVoucher}       
        onSubmit={handleFormSubmit}   
        onDelete={handleDelete}       
      />
    </div>
  );
};

export default AdminVouchers;