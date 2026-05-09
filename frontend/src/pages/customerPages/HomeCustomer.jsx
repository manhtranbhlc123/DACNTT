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

const HomeCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [selectedCustomer, setSelectedCustomer] = useState(null); 
  const modalFields = [
    { header: "Họ và tên", accessor: "hoTen", required: true, className: "col-span-1" },
    { header: "Email", accessor: "email", type: "email", required: true },
    { header: "Số điện thoại", accessor: "soDienThoai", required: true },
    { 
      header: "Ngày sinh", 
      accessor: "ngaySinh", 
      type: "date", 
      required: true,
      render: (data) => data.ngaySinh ? new Date(data.ngaySinh).toLocaleDateString('vi-VN') : '' 
    },
    { 
      header: "Giới tính", 
      accessor: "gioiTinh", 
      type: "select", 
      options: [{value: "Nam", label: "Nam"}, {value: "Nữ", label: "Nữ"}],
      defaultValue: "Nam"
    },
    { 
      header: "Trạng thái", 
      accessor: "trangThai", 
      defaultValue: "Hoạt động",
      placeholder: "VD: Hoạt động, Bị khóa..."
    },
    { header: "Địa chỉ", accessor: "diaChi", required: true, className: "col-span-2" },
  ];
 
  const columns = [
    { header: "No.", render: (row, index) => index + 1, className: "w-12" },
    { header: "Họ và tên", accessor: "hoTen" },
    { header: "Email", accessor: "email" },
    { header: "SĐT", accessor: "soDienThoai" },
    { header: "Giới tính", accessor: "gioiTinh" },
    { header: "Trạng thái", accessor: "trangThai" },
    {
      header: "Thao tác",
      className: "w-48",
      render: (row) => (
        <div className="flex justify-center gap-x-4">
          <button onClick={() => handleOpenModal('details', row)}>
            <BsInfoCircle className="text-2xl text-green-800" />
          </button>
          <button onClick={() => handleOpenModal('edit', row)}>
            <AiOutlineEdit className="text-2xl text-yellow-800" />
          </button>
          <button onClick={() => handleOpenModal('delete', row)}>
            <MdOutlineDelete className="text-2xl text-red-800" />
          </button>
        </div>
      ),
    },
  ];
  
  const fetchCustomers = () => {
    axios.get('http://localhost:5555/customers')  
      .then((response) => setCustomers(response.data.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleOpenModal = (type, customer = null) => {
    setModalType(type);
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };
 
  const handleFormSubmit = async (formData) => {
    try {
      if (modalType === 'create') {
        await axios.post('http://localhost:5555/customers', formData);
        alert('Thêm khách hàng thành công!');
      } else if (modalType === 'edit') {
        await axios.put(`http://localhost:5555/customers/${selectedCustomer._id}`, formData);
        alert('Cập nhật thành công!');
      }
      handleCloseModal();
      fetchCustomers();
    } catch (error) {
      console.log(error);
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };
 
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5555/customers/${selectedCustomer._id}`);
      alert('Xóa thành công!');
      handleCloseModal();
      fetchCustomers();
    } catch (error) {
      console.log(error);
      alert('Lỗi khi xóa!');
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <Header />
      <div className='flex flex-1 flex-row overflow-hidden'>
        <Sidebar />
        <div className='flex flex-col w-full h-full overflow-hidden'> 
          <ActionToolbar onAdd={() => handleOpenModal('create')} />
          <div className='bg-gray-50 flex-1 p-4 overflow-auto'>
            <DataTable columns={columns} data={customers} />
          </div>
          <Next />
        </div>
      </div> 
      <ActionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={
            modalType === 'create' ? 'Thêm khách hàng mới' : 
            modalType === 'edit' ? 'Chỉnh sửa thông tin' : 
            modalType === 'details' ? 'Hồ sơ khách hàng' : 'Xác nhận xóa'
        }
        type={modalType}
        fields={modalFields}          
        data={selectedCustomer}       
        onSubmit={handleFormSubmit}   
        onDelete={handleDelete}       
      />
    </div>
  );
};

export default HomeCustomer;