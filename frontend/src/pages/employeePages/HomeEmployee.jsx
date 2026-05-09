// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { AiOutlineEdit, AiOutlineClose } from 'react-icons/ai';
// import { BsInfoCircle } from 'react-icons/bs';
// import { MdOutlineDelete, MdOutlineAddBox } from 'react-icons/md';
// import { Sidebar } from '../../components/Sidebar';
// import { Header } from '../../components/Header';
// import { ActionToolbar } from '../../components/ActionToolbar';
// import { Next } from '../../components/Next';
// import { DataTable } from '../../components/DataTable';

// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto relative shadow-xl">
//         <div className="flex justify-between items-center mb-4 border-b pb-2">
//           <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">
//             <AiOutlineClose />
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };

// const HomeEmployee = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState(''); 
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   const [formData, setFormData] = useState({
//     hoTen: '',
//     email: '',
//     soDienThoai: '',
//     ngaySinh: '',
//     gioiTinh: 'Nam',
//     diaChi: '',
//     chucVu: '',
//     luong: '',
//     caLam: '',
//     trangThai: '',  
//     thamNien: '',    
//     thuong: 0,      
//     ngayNghi: 0      
//   });
//   const fetchEmployees = () => {
//     setLoading(true);
//     axios.get('http://localhost:5555/employees')
//       .then((response) => {
//         setEmployees(response.data.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.log(error);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     fetchEmployees();
//   }, []);
//   const handleOpenModal = (type, employee = null) => {
//     setModalType(type);
//     setSelectedEmployee(employee);
    
//     if (employee && (type === 'edit' || type === 'details')) {
//       setFormData({
//         ...employee,
//         ngaySinh: employee.ngaySinh ? new Date(employee.ngaySinh).toISOString().split('T')[0] : '',
//         thuong: employee.thuong || 0,
//         ngayNghi: employee.ngayNghi || 0,
//         thamNien: employee.thamNien || '',
//         trangThai: employee.trangThai || ''
//       });
//     } else {
//       setFormData({
//         hoTen: '', email: '', soDienThoai: '', ngaySinh: '', gioiTinh: 'Nam',
//         diaChi: '', chucVu: '', luong: '', caLam: '',
//         trangThai: 'Đang làm việc', thamNien: '0', thuong: 0, ngayNghi: 0
//       });
//     }
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedEmployee(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (modalType === 'create') {
//         await axios.post('http://localhost:5555/employees', formData);
//         alert('Thêm nhân viên thành công!');
//       } else if (modalType === 'edit') {
//         await axios.put(`http://localhost:5555/employees/${selectedEmployee._id}`, formData);
//         alert('Cập nhật thành công!');
//       }
//       handleCloseModal();
//       fetchEmployees();
//     } catch (error) {
//       console.log(error);
//       alert(`Lỗi: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`http://localhost:5555/employees/${selectedEmployee._id}`);
//       alert('Xóa thành công!');
//       handleCloseModal();
//       fetchEmployees();
//     } catch (error) {
//       console.log(error);
//       alert('Lỗi khi xóa!');
//     }
//   };

//   const columns = [
//     { header: "No.", render: (row, index) => index + 1, className: "w-12" },
//     { header: "Họ và tên", accessor: "hoTen" },
//     { header: "Chức vụ", accessor: "chucVu" },
//     { header: "SĐT", accessor: "soDienThoai" },
//     { header: "Ca làm", accessor: "caLam" },
//     { header: "Lương", accessor: "luong", render: (row) => row.luong?.toLocaleString() },
//     { header: "Trạng thái", accessor: "trangThai" },
//     {
//       header: "Thao tác",
//       className: "w-48",
//       render: (row) => (
//         <div className="flex justify-center gap-x-4">
//           <button onClick={() => handleOpenModal('details', row)}>
//             <BsInfoCircle className="text-2xl text-green-800" />
//           </button>
//           <button onClick={() => handleOpenModal('edit', row)}>
//             <AiOutlineEdit className="text-2xl text-yellow-800" />
//           </button>
//           <button onClick={() => handleOpenModal('delete', row)}>
//             <MdOutlineDelete className="text-2xl text-red-800" />
//           </button>
//         </div>
//       ),
//     },
//   ];
//   const renderModalContent = () => {
//     if (modalType === 'delete') {
//       return (
//         <div className="text-center">
//           <h3 className="text-lg">Bạn có chắc chắn muốn xóa nhân viên <b>{selectedEmployee?.hoTen}</b>?</h3>
//           <div className="mt-6 flex justify-center gap-4">
//             <button onClick={handleDelete} className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-semibold">Xóa bỏ</button>
//             <button onClick={handleCloseModal} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 font-semibold">Hủy</button>
//           </div>
//         </div>
//       );
//     }

//     if (modalType === 'details') {
//       return (
//         <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
//             <div className='col-span-2 text-center text-2xl font-bold mb-4 text-sky-700 uppercase'>{selectedEmployee?.hoTen}</div>
//             <p className='border-b pb-1'><strong>Email:</strong> {selectedEmployee?.email}</p>
//             <p className='border-b pb-1'><strong>SĐT:</strong> {selectedEmployee?.soDienThoai}</p>
//             <p className='border-b pb-1'><strong>Ngày sinh:</strong> {new Date(selectedEmployee?.ngaySinh).toLocaleDateString('vi-VN')}</p>
//             <p className='border-b pb-1'><strong>Giới tính:</strong> {selectedEmployee?.gioiTinh}</p>
//             <p className='border-b pb-1'><strong>Chức vụ:</strong> {selectedEmployee?.chucVu}</p>
//             <p className='border-b pb-1'><strong>Ca làm:</strong> {selectedEmployee?.caLam}</p>
//             <p className='border-b pb-1'><strong>Lương:</strong> {selectedEmployee?.luong?.toLocaleString()} VNĐ</p>
//             <p className='border-b pb-1'><strong>Thưởng:</strong> {selectedEmployee?.thuong?.toLocaleString()} VNĐ</p>
//             <p className='border-b pb-1'><strong>Thâm niên:</strong> {selectedEmployee?.thamNien}</p>
//             <p className='border-b pb-1'><strong>Ngày nghỉ:</strong> {selectedEmployee?.ngayNghi}</p>
//             <p className='border-b pb-1'><strong>Trạng thái:</strong> {selectedEmployee?.trangThai}</p>
//             <p className='border-b pb-1'><strong>Địa chỉ:</strong> {selectedEmployee?.diaChi}</p>
//         </div>
//       );
//     }
//     return (
//       <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-semibold text-gray-600">Họ tên </label>
//           <input name="hoTen" value={formData.hoTen} onChange={handleInputChange} required className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-600">Email </label>
//           <input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-600">SĐT</label>
//           <input name="soDienThoai" value={formData.soDienThoai} onChange={handleInputChange} required className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-600">Ngày sinh </label>
//           <input name="ngaySinh" type="date" value={formData.ngaySinh} onChange={handleInputChange} required className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-600">Giới tính</label>
//           <select name="gioiTinh" value={formData.gioiTinh} onChange={handleInputChange} className="border w-full p-2 rounded focus:outline-sky-500">
//             <option value="Nam">Nam</option>
//             <option value="Nữ">Nữ</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-600">Chức vụ </label>
//           <input name="chucVu" value={formData.chucVu} onChange={handleInputChange} required className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-600">Lương cơ bản</label>
//           <input name="luong" type="number" value={formData.luong} onChange={handleInputChange} required className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-600">Ca làm</label>
//           <input name="caLam" value={formData.caLam} onChange={handleInputChange} required className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div>
//             <label className="block text-sm font-semibold text-gray-600">Thưởng</label>
//             <input name="thuong" type="number" value={formData.thuong} onChange={handleInputChange} className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div>
//             <label className="block text-sm font-semibold text-gray-600">Thâm niên</label>
//             <input name="thamNien" value={formData.thamNien} onChange={handleInputChange} className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div>
//             <label className="block text-sm font-semibold text-gray-600">Số ngày nghỉ</label>
//             <input name="ngayNghi" type="number" value={formData.ngayNghi} onChange={handleInputChange} className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div>
//             <label className="block text-sm font-semibold text-gray-600">Trạng thái</label>
//             <input name="trangThai" value={formData.trangThai} onChange={handleInputChange} placeholder="VD: Đang làm việc" className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div className="col-span-2">
//             <label className="block text-sm font-semibold text-gray-600">Địa chỉ</label>
//             <input name="diaChi" value={formData.diaChi} onChange={handleInputChange} required className="border w-full p-2 rounded focus:outline-sky-500" />
//         </div>
//         <div className="col-span-2 flex justify-end gap-3 mt-6 border-t pt-4">
//           <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-700 px-5 py-2 rounded hover:bg-gray-300 font-medium">Hủy</button>
//           <button type="submit" className="bg-sky-600 text-white px-5 py-2 rounded hover:bg-sky-700 font-medium shadow-md">
//             {modalType === 'create' ? 'Lưu nhân viên' : 'Cập nhật'}
//           </button>
//         </div>
//       </form>
//     );
//   };

//   return (
//     <div className='h-screen flex flex-col'>
//       <Header />
//       <div className='flex flex-1 flex-row overflow-hidden'>
//         <Sidebar />
//         <div className='flex flex-col w-full h-full overflow-hidden'>
//           <ActionToolbar onAdd = {() => handleOpenModal('create')}/>
//           <div className='bg-gray-50 flex-1 p-4 overflow-auto'>
//             <DataTable columns={columns} data={employees} />
//           </div>
//           <Next />
//         </div>
//       </div>

//       <Modal 
//         isOpen={modalOpen} 
//         onClose={handleCloseModal} 
//         title={
//             modalType === 'create' ? 'Thêm nhân viên mới' : 
//             modalType === 'edit' ? 'Chỉnh sửa thông tin' : 
//             modalType === 'details' ? 'Hồ sơ nhân viên' : 'Xác nhận xóa'
//         }
//       >
//         {renderModalContent()}
//       </Modal>
//     </div>
//   );
// };

// export default HomeEmployee;


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

const HomeEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [selectedEmployee, setSelectedEmployee] = useState(null);
 
  const modalFields = [
    { header: "Họ tên", accessor: "hoTen", required: true, className: "col-span-1" },
    { header: "Email", accessor: "email", type: "email", required: true },
    { header: "SĐT", accessor: "soDienThoai", required: true },
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
    { header: "Chức vụ", accessor: "chucVu", required: true },
    { header: "Ca làm", accessor: "caLam", required: true },
    { header: "Lương cơ bản", accessor: "luong", type: "number", required: true, render: (d) => Number(d.luong).toLocaleString() },
    { header: "Thưởng", accessor: "thuong", type: "number", defaultValue: 0, render: (d) => Number(d.thuong).toLocaleString() },
    { header: "Thâm niên", accessor: "thamNien", defaultValue: 0 },
    { header: "Ngày nghỉ", accessor: "ngayNghi", type: "number", defaultValue: 0 },
    { header: "Trạng thái", accessor: "trangThai", defaultValue: "Đang làm việc" },
    { header: "Địa chỉ", accessor: "diaChi", required: true, className: "col-span-2" },
  ];
 
  const columns = [
    { header: "No.", render: (row, index) => index + 1, className: "w-12" },
    { header: "Họ và tên", accessor: "hoTen" },
    { header: "Chức vụ", accessor: "chucVu" },
    { header: "SĐT", accessor: "soDienThoai" },
    { header: "Ca làm", accessor: "caLam" },
    { header: "Lương", accessor: "luong", render: (row) => row.luong?.toLocaleString() },
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

  const fetchEmployees = () => {
    axios.get('http://localhost:5555/employees')
      .then((response) => setEmployees(response.data.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleOpenModal = (type, employee = null) => {
    setModalType(type);
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
  };
 
  const handleFormSubmit = async (formData) => {
    try {
      if (modalType === 'create') {
        await axios.post('http://localhost:5555/employees', formData);
        alert('Thêm nhân viên thành công!');
      } else if (modalType === 'edit') {
        await axios.put(`http://localhost:5555/employees/${selectedEmployee._id}`, formData);
        alert('Cập nhật thành công!');
      }
      handleCloseModal();
      fetchEmployees();
    } catch (error) {
      console.log(error);
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5555/employees/${selectedEmployee._id}`);
      alert('Xóa thành công!');
      handleCloseModal();
      fetchEmployees();
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
            <DataTable columns={columns} data={employees} />
          </div>
          <Next />
        </div>
      </div>
 
      <ActionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={
            modalType === 'create' ? 'Thêm nhân viên mới' : 
            modalType === 'edit' ? 'Chỉnh sửa thông tin' : 
            modalType === 'details' ? 'Hồ sơ nhân viên' : 'Xác nhận xóa'
        }
        type={modalType}
        fields={modalFields}         
        data={selectedEmployee}        
        onSubmit={handleFormSubmit}    
        onDelete={handleDelete}       
      />
    </div>
  );
};

export default HomeEmployee;