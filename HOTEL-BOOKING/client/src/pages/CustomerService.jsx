import React, { useState } from 'react';

const CustomerService = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Xin chào Thang! Tôi có thể hỗ trợ bạn về lỗi kỹ thuật hoặc đặt phòng.' }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    // Logic xử lý thông minh hơn dựa trên tài liệu ERR_NGROK_3200
    setTimeout(() => {
      const aiReply = getAIResponse(input);
      setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);
    }, 800);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* CỘT 1: THÔNG TIN LIÊN HỆ & TÀI LIỆU LỖI */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-red-100">
            <h3 className="text-red-600 font-bold flex items-center">
              <span className="mr-2">⚠️</span> Hỗ trợ lỗi Ngrok
            </h3>
            <div className="mt-3 text-sm text-gray-600 space-y-2">
              <p className="font-semibold text-gray-800 underline">ERR_NGROK_3200</p>
              <p>Lỗi này xảy ra khi endpoint bị offline hoặc agent chưa chạy.</p>
              <code className="block bg-gray-100 p-2 rounded text-xs">
                ngrok http [port]
              </code>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold mb-3">Liên hệ nhanh</h3>
            <p className="text-sm text-gray-500">Email: support@ngrok.com</p>
          </div>
        </div>git i

        {/* CỘT 2 & 3: CHAT BOX AI */}
        <div className="lg:col-span-3 flex flex-col h-[650px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-blue-600 text-white">
            <h3 className="font-bold uppercase tracking-wider">Trợ lý Kỹ thuật & CSKH</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 shadow-md rounded-tl-none border border-gray-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về lỗi 3200 hoặc cách chạy ngrok..."
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
              Gửi
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

// Hàm logic AI mô phỏng
function getAIResponse(text) {
  const input = text.toLowerCase();
  if (input.includes("3200") || input.includes("offline") || input.includes("ngrok")) {
    return "Tôi thấy bạn đang gặp lỗi ERR_NGROK_3200. Hãy đảm bảo bạn đã chạy lệnh 'ngrok http [port]' trong terminal. Nếu bạn dùng domain riêng, hãy thêm tham số --url.";
  }
  if (input.includes("chào") || input.includes("hi")) {
    return "Chào Thang! Tôi có thể giúp gì cho dự án web của bạn hôm nay?";
  }
  return "Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể nói rõ hơn về vấn đề kỹ thuật đang gặp phải không?";
}

export default CustomerService;