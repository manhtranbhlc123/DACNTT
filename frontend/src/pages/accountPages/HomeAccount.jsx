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

const HomeAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  const modalFields = [
    { 
      header: "Tên đăng nhập", 
      accessor: "username", 
      required: true 
    },
    { 
      header: "Email", 
      accessor: "email", 
      required: true 
    },
    { 
      header: "Mật khẩu", 
      accessor: "password", 
      type: "password", 
      required: true,
    },
    { 
      header: "Vai trò (Role)", 
      accessor: "role", 
      type: "select", 
      required: true,
      options: [
        { value: "customer", label: "Khách hàng (Customer)" },
        { value: "employee", label: "Nhân viên (Employee)" },
        { value: "admin", label: "Quản trị viên (Admin)" }
      ],
      defaultValue: "customer"
    },
    { 
      header: "Trạng thái", 
      accessor: "trangThai", 
      defaultValue: "Hoạt động",
      placeholder: "VD: Hoạt động, Đã khóa..."
    },
  ];
 
  const columns = [
    { header: "No.", render: (row, index) => index + 1, className: "w-12" },
    { header: "Username", accessor: "username", className: "font-bold" },
    { header: "Email", accessor: "email", className: "font-bold" },
    { 
      header: "Vai trò", 
      accessor: "role",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          row.role === 'admin' ? 'bg-red-100 text-red-700' :
          row.role === 'employee' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {row.role ? row.role.toUpperCase() : 'UNKNOWN'}
        </span>
      )
    },
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
 
  const fetchAccounts = () => { 
    axios.get('http://localhost:5555/accounts') 
      .then((response) => setAccounts(response.data.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleOpenModal = (type, account = null) => {
    setModalType(type);
    setSelectedAccount(account);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAccount(null);
  };
 
  const handleFormSubmit = async (formData) => {
    try {
      if (modalType === 'create') {
        await axios.post('http://localhost:5555/accounts', formData);
        alert('Tạo tài khoản thành công!');
      } else if (modalType === 'edit') { 
        await axios.put(`http://localhost:5555/accounts/${selectedAccount._id}`, formData);
        alert('Cập nhật tài khoản thành công!');
      }
      handleCloseModal();
      fetchAccounts();
    } catch (error) {
      console.log(error); 
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };
 
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5555/accounts/${selectedAccount._id}`);
      alert('Xóa tài khoản thành công!');
      handleCloseModal();
      fetchAccounts();
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
            <DataTable columns={columns} data={accounts} />
          </div>
          <Next />
        </div>
      </div>
 
      <ActionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={
            modalType === 'create' ? 'Tạo tài khoản mới' : 
            modalType === 'edit' ? 'Cập nhật tài khoản' : 
            modalType === 'details' ? 'Chi tiết tài khoản' : 'Xác nhận xóa'
        }
        type={modalType}
        fields={modalFields}          
        data={selectedAccount}       
        onSubmit={handleFormSubmit}   
        onDelete={handleDelete}       
      />
    </div>
  );
};

export default HomeAccount;