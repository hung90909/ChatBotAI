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

    // Chuyển messages sang định dạng OpenRouter
    const messages = [];

    // Thêm system prompt
    if (body.system) {
      messages.push({ role: 'system', content: body.system });
    }

    // Thêm lịch sử chat
    body.messages.forEach(m => {
      messages.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content });
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://hung90909.github.io',
        'X-Title': 'NOVA Chatbot',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: messages,
        max_tokens: 1000,
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || JSON.stringify(data);

    // Trả về định dạng giống cũ để không cần sửa index.html
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
