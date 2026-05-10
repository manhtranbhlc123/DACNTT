import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

export async function getAIReply(message) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error("Missing OPENAI_API_KEY");
    }

    const client = new OpenAI({
        apiKey
    });

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [
            {
                role: "system",
                content: `
Bạn là AI chatbot lễ tân khách sạn.

NHIỆM VỤ CHÍNH:

1. PHÂN LOẠI Ý ĐỊNH (Intent):
- booking: đặt phòng
- faq: hỏi thông tin khách sạn
- cancel: hủy phòng
- handoff: khiếu nại / yêu cầu phức tạp
- unknown: không hiểu

2. FAQ CHUẨN:
- check-in: 14:00
- check-out: 12:00
- wifi: miễn phí
- hồ bơi: có
- bãi đỗ xe: có
- thú cưng: tùy loại phòng

3. BOOKING FLOW:
Nếu khách muốn đặt phòng:
- hỏi ngày check-in
- hỏi ngày check-out
- hỏi số người
- KHÔNG tự tạo giá nếu chưa có dữ liệu

4. HANDOFF:
Nếu khách:
- khiếu nại
- hoàn tiền
- yêu cầu phức tạp
→ trả lời:
"Tôi sẽ chuyển bạn đến nhân viên hỗ trợ để xử lý"

5. CÁCH TRẢ LỜI:
- ngắn gọn
- đúng vai lễ tân khách sạn
- không lan man
- nếu thiếu thông tin → phải hỏi lại
                `.trim()
            },
            {
                role: "user",
                content: message
            }
        ],

        temperature: 0.4
    });

    return response.choices[0].message.content;
}
