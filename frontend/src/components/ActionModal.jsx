import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const DynamicInput = ({ field, value, onChange }) => {
  const baseClass = "border w-full p-2 rounded focus:outline-sky-500";
  const safeValue = value !== undefined && value !== null ? value : '';

  if (field.type === 'select') {
    return (
      <select
        name={field.accessor}
        value={safeValue}
        onChange={onChange}
        className={baseClass}
        required={field.required}
        disabled={field.readOnly}
      >
        <option value="">-- Chọn --</option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'multi-select') {
    const selectedIds = Array.isArray(value) ? value : [];
    const handleCheckboxChange = (optionValue) => {
      let newValues;
      if (selectedIds.includes(optionValue)) {
        newValues = selectedIds.filter(id => id !== optionValue);
      } else {
        newValues = [...selectedIds, optionValue];
      }
      onChange({ target: { name: field.accessor, value: newValues } });
    };

    return (
      <div className="border p-2 rounded max-h-48 overflow-y-auto bg-gray-50">
        {field.options?.map((opt) => (
          <div key={opt.value} className="flex items-center mb-2 last:mb-0">
            <input
              type="checkbox"
              id={`opt-${opt.value}`}
              checked={selectedIds.includes(opt.value)}
              onChange={() => handleCheckboxChange(opt.value)}
              disabled={field.readOnly}
              className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
            />
            <label htmlFor={`opt-${opt.value}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
              {opt.label}
            </label>
          </div>
        ))}
        {field.options?.length === 0 && <span className="text-gray-400 text-sm">Không có dữ liệu</span>}
      </div>
    );
  }

  return (
    <input
      type={field.type || 'text'}
      name={field.accessor}
      value={safeValue}
      onChange={onChange}
      placeholder={field.placeholder}
      required={field.required}
      className={`${baseClass} ${field.readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      readOnly={field.readOnly}
    />
  );
};

export const ActionModal = ({ isOpen, onClose, title, type, fields, data, onSubmit, onDelete }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      if ((type === 'edit' || type === 'details') && data) {
        const formattedData = { ...data };
        fields.forEach(field => {
           if(field.type === 'date' && data[field.accessor]){
                formattedData[field.accessor] = new Date(data[field.accessor]).toISOString().split('T')[0];
           }
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(formattedData);
      } else {
        const initialData = {};
        fields.forEach(field => {
            if (field.defaultValue !== undefined) {
                initialData[field.accessor] = field.defaultValue;
            }
        });
        setFormData(initialData);
      }
    }
  }, [isOpen, type, data, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto relative shadow-xl">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl"><AiOutlineClose /></button>
        </div>

        {type === 'delete' && (
          <div className="text-center">
            <h3 className="text-lg mb-6">Bạn có chắc chắn muốn xóa không?</h3>
            <div className="flex justify-center gap-4">
              <button onClick={onDelete} className="bg-red-600 text-white px-6 py-2 rounded font-semibold">Xóa bỏ</button>
              <button onClick={onClose} className="bg-gray-300 px-6 py-2 rounded font-semibold">Hủy</button>
            </div>
          </div>
        )}

        {type === 'details' && (
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
            {fields.map((field, index) => (
              <div key={index} className={`border-b pb-1 ${field.className || ''}`}>
                <strong className="mr-2">{field.header}:</strong>
                <span>
                  {field.render ? field.render(formData) : 
                   (Array.isArray(formData[field.accessor]) ? formData[field.accessor].join(', ') : formData[field.accessor])}
                </span>
              </div>
            ))}
             <div className="col-span-2 flex justify-end mt-4">
                <button onClick={onClose} className="bg-gray-200 px-5 py-2 rounded font-medium">Đóng</button>
            </div>
          </div>
        )}

        {(type === 'create' || type === 'edit') && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {fields.map((field, index) => (
              !(typeof field.hiddenInForm === 'function' ? field.hiddenInForm(type) : field.hiddenInForm) && (
                <div key={index} className={field.className || ''}>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">{field.header}</label>
                  <DynamicInput field={field} value={formData[field.accessor]} onChange={handleChange} />
                </div>
              )
            ))}
            <div className="col-span-2 flex justify-end gap-3 mt-6 border-t pt-4">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-5 py-2 rounded">Hủy</button>
              <button type="submit" className="bg-sky-600 text-white px-5 py-2 rounded shadow-md">
                {type === 'create' ? 'Lưu lại' : 'Cập nhật'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};