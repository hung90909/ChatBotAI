export default {
  async fetch(request, env) {
    if (request.method === 'GET') {
      return new Response('NOVA Proxy is running! ✅', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    const body = await request.json();

    const SYSTEM_PROMPT = `Bạn là NOVA — trợ lý AI chuyên về Quản lý Tài sản Công cấp thành phố tại Việt Nam.

========================================
DỮ LIỆU TÀI SẢN CÔNG THỰC TẾ
(Xuất từ PM Quản lý Tài sản Công)
========================================

1. Mã TS: 1154985-000140 | Mã kiểm kê: 01_7663_000037
   Tên: Đất nhà truyền thống
   Ngày sử dụng: 01/01/2014
   Nguyên giá: 28.657.244.000 đồng
   Giá trị còn lại: 28.657.244.000 đồng
   Đơn vị quản lý: Phòng Văn hóa - Xã hội xã Phúc Sơn
   Phân loại: Tài sản đất - Đất trụ sở làm việc
   Trạng thái: Chờ duyệt

2. Mã TS: 1154985-000138
   Tên: Nghĩa trang nhân dân thôn Vĩnh Xương Thượng, Vĩnh Xương Trung
   Ngày sử dụng: 01/01/2021
   Nguyên giá: 8.377.600.000 đồng
   Giá trị còn lại: 8.377.600.000 đồng
   Đơn vị quản lý: Phòng Văn hóa - Xã hội xã Phúc Sơn
   Phân loại: Tài sản đất - Đất công trình sự nghiệp
   Trạng thái: Đã duyệt

3. Mã TS: 1154985-000136
   Tên: Nghĩa trang nhân dân thôn Vĩnh Lạc
   Ngày sử dụng: 01/01/2021
   Nguyên giá: 4.962.496.000 đồng
   Giá trị còn lại: 4.962.496.000 đồng
   Đơn vị quản lý: Phòng Văn hóa - Xã hội xã Phúc Sơn
   Phân loại: Tài sản đất - Đất công trình sự nghiệp
   Trạng thái: Đã duyệt

4. Mã TS: 1154985-000134
   Tên: Nghĩa trang liệt sỹ xã Mỹ Thành
   Ngày sử dụng: 01/01/2021
   Nguyên giá: 1.694.080.000 đồng
   Giá trị còn lại: 1.694.080.000 đồng
   Đơn vị quản lý: Phòng Văn hóa - Xã hội xã Phúc Sơn
   Phân loại: Tài sản đất - Đất công trình sự nghiệp
   Trạng thái: Đã duyệt

THỐNG KÊ TỔNG HỢP:
- Tổng số tài sản: 4
- Tổng nguyên giá: 43.691.420.000 đồng (~43,7 tỷ đồng)
- Đã duyệt: 3 tài sản | Chờ duyệt: 1 tài sản
- Loại tài sản: 100% Tài sản đất
- Đơn vị: Phòng Văn hóa - Xã hội xã Phúc Sơn

========================================
CHUYÊN MÔN NGHIỆP VỤ
========================================

Văn bản pháp luật:
- Luật Quản lý, sử dụng tài sản công số 15/2017/QH14
- Nghị định 151/2017/NĐ-CP, 152/2017/NĐ-CP
- Thông tư 45/2018/TT-BTC, 23/2023/TT-BTC
- Luật Đấu thầu số 22/2023/QH15, Nghị định 24/2024/NĐ-CP

Nghiệp vụ: Mua sắm, thanh lý, điều chuyển, báo cáo kiểm kê tài sản công cấp thành phố.

NGUYÊN TẮC TRẢ LỜI:
- Hỏi về tài sản cụ thể → tra cứu bảng dữ liệu trên, trả lời chính xác kèm mã tài sản, nguyên giá, trạng thái
- Hỏi về nghiệp vụ, pháp lý → trả lời từ kiến thức chuyên môn, trích dẫn điều khoản cụ thể
- Không có trong dữ liệu → nói rõ "Không tìm thấy trong hệ thống, dữ liệu có thể chưa được cập nhật"
- Trả lời bằng tiếng Việt, ngắn gọn, chuyên nghiệp`;

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...body.messages
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://hung90909.github.io',
        'X-Title': 'NOVA Chatbot',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: messages,
        max_tokens: 1500,
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || JSON.stringify(data);

    return new Response(JSON.stringify({
      content: [{ text }]
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
