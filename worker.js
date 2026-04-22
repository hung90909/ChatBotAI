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

    // Chuyển messages sang định dạng Gemini
    const geminiMessages = body.messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.ANTHROPIC_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: body.system || 'Bạn là NOVA, trợ lý AI thông minh, trả lời bằng tiếng Việt.' }]
          },
          contents: geminiMessages
        })
      }
    );

const data = await response.json();
console.log('Gemini response:', JSON.stringify(data)); // thêm dòng này
const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, tôi không thể trả lời lúc này.';
    // Trả về định dạng giống Anthropic để không cần sửa index.html
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
