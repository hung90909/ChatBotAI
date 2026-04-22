export default {
  async fetch(request, evn) {
    // Xử lý GET request (test trực tiếp trên trình duyệt)
    if (request.method === 'GET') {
      return new Response('NOVA Proxy is running! ✅', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Xử lý CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Xử lý POST từ chatbot
    const body = await request.json();
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': evn.ANTHROPIC_KEY, // API key của bạn
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
