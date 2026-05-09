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

const HomeCart = () => {
  const [carts, setCarts] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedCart, setSelectedCart] = useState(null);
 
  const fetchData = async () => {
    try {
        const [cartRes, userRes] = await Promise.all([
            axios.get('http://localhost:5555/carts'),
            axios.get('http://localhost:5555/accounts'), 
        ]); 
        setCarts(cartRes.data.data);
         
        const userOptions = userRes.data.data
            .filter(u => u.role === 'customer')
            .map(u => ({ value: u._id, label: `${u.username} (${u.role})` }));
        setUsers(userOptions);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, []);
 
  const modalFields = [
    { 
      header: "Khách hàng sở hữu", 
      accessor: "account", 
      type: "select",          
      options: users,          
      required: true,
      className: "col-span-2",
      readOnly: modalType === 'edit' || modalType === 'details', 
      render: (d) => {
          if (d.account && typeof d.account === 'object') return `${d.account.username} (${d.account.email})`;
          const u = users.find(x => x.value === d.account);
          return u ? u.label : "Không xác định";
      }
    }, 
     
    { 
      header: "Danh sách sản phẩm trong giỏ", 
      accessor: "items",  
      type: "textarea",
      className: "col-span-2 font-medium text-gray-800",
      readOnly: true, 
      render: (cart) => {
        const items = cart?.items || [];
        if (items.length === 0) return "Giỏ hàng trống";

        return items.map((item, idx) => {
            const tenSP = item.product?.tenSanPham || "Sản phẩm đã xóa/ngừng kinh doanh";
            const gia = Number(item.product?.giaBan || 0).toLocaleString();
            return `${idx + 1}. ${tenSP} (Size: ${item.size}) x ${item.quantity} [Giá: ${gia}đ]`;
        }).join('\n'); 
      }
    },

    { 
      header: "Tạm tính tổng tiền", 
      accessor: "totalPrice", 
      type: "text", 
      readOnly: true, 
      className: "col-span-2 font-bold text-red-600 text-lg",
      render: (d) => { 
          const total = d.items?.reduce((acc, curr) => acc + (curr.quantity * (curr.product?.giaBan || 0)), 0) || 0;
          return `${total.toLocaleString()} VND`;
      }
    },
  ]; 
 
  const columns = [
    { header: "No.", render: (row, index) => index + 1, className: "w-12 text-center" },
    { 
      header: "Khách hàng", 
      accessor: "account",
      render: (row) => (
        <div className="flex flex-col">
            <span className="font-bold text-blue-700 text-sm">{row.account?.username || "Unknown"}</span>
            <span className="text-xs text-gray-500">{row.account?.email}</span>
        </div>
      )
    }, 
    { 
      header: "Sản phẩm", 
      accessor: "items",  
      render: (row) => {
        const items = row.items || [];
        if (items.length === 0) return <span className="text-gray-400 italic">Trống</span>;
        const firstItemName = items[0]?.product?.tenSanPham || "Sản phẩm lỗi";
        const remainingCount = items.length - 1;
        
        return (
            <div className="text-sm">
                <span className="font-medium text-gray-800">{firstItemName}</span>
                {remainingCount > 0 && (
                    <span className="text-gray-500 ml-1 italic">(+{remainingCount} món khác)</span>
                )}
            </div>
        );
      }
    }, 
    { 
      header: "Tổng tiền (tạm tính)", 
      accessor: "price",
      render: (row) => { 
         const total = row.items?.reduce((acc, curr) => acc + (curr.quantity * (curr.product?.giaBan || 0)), 0) || 0;
         return <span className="font-bold text-green-600 text-sm">{total.toLocaleString()} đ</span>
      }
    },
    {
      header: "Thao tác",
      className: "w-40 text-center",
      render: (row) => (
        <div className="flex justify-center gap-x-2">
          <button onClick={() => handleOpenModal('details', row)} title="Xem chi tiết" className="p-1 hover:bg-gray-100 rounded">
            <BsInfoCircle className="text-xl text-green-700" />
          </button>
          <button onClick={() => handleOpenModal('create', row)} title="Thêm mới (Reset)" className="p-1 hover:bg-gray-100 rounded"> 
            <AiOutlineEdit className="text-xl text-yellow-700" />
          </button>
          <button onClick={() => handleOpenModal('delete', row)} title="Xóa giỏ hàng" className="p-1 hover:bg-gray-100 rounded">
            <MdOutlineDelete className="text-xl text-red-700" />
          </button>
        </div>
      ),
    },
  ];

  const handleOpenModal = (type, cart = null) => {
    setModalType(type);
    if (cart) { 
        const mappedCart = JSON.parse(JSON.stringify(cart)); 
        if (mappedCart.account && typeof mappedCart.account === 'object') {
            mappedCart.account = mappedCart.account._id;
        }
        setSelectedCart(mappedCart); 
    } else {
        setSelectedCart(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCart(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (modalType === 'create') {  
        await axios.post('http://localhost:5555/carts', { 
            accountId: formData.account,
            productId: null, quantity: 0, size: 0  
        });
        alert('Đã tạo/reset giỏ hàng cho khách hàng này!');

      } else {
        alert('Admin chỉ hỗ trợ Xem và Xóa giỏ hàng. Việc thêm sửa sản phẩm nên thực hiện ở Client.');
      }
      
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.log(error);
      alert(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async () => {
    if(!window.confirm("Bạn chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng này?")) return;
    try {  
      const accountId = selectedCart.account?._id || selectedCart.account; 
      await axios.delete(`http://localhost:5555/carts/${accountId}`);
      alert('Đã xóa giỏ hàng thành công!');
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.log(error);
      alert('Lỗi khi xóa!');
    }
  };

  return (
    <div className='h-screen flex flex-col font-sans bg-gray-50'>
      <Header />
      <div className='flex flex-1 flex-row overflow-hidden'>
        <Sidebar />
        <div className='flex flex-col w-full h-full overflow-hidden'>
          <ActionToolbar onAdd={() => handleOpenModal('create')} />
          <div className='flex-1 p-4 overflow-auto'>
             <div className="bg-white rounded shadow-sm border border-gray-200">
                <DataTable columns={columns} data={carts} />
             </div>
          </div>
          <Next />
        </div>
      </div>

      <ActionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={
            modalType === 'create' ? 'Tạo/Reset giỏ hàng' : 
            modalType === 'details' ? 'Chi tiết giỏ hàng' : 'Xác nhận xóa'
        }
        type={modalType}
        fields={modalFields}          
        data={selectedCart}       
        onSubmit={handleFormSubmit}   
        onDelete={handleDelete}       
      />
    </div>
  );
};

export default HomeCart;