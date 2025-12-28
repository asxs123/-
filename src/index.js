export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 如果是API请求，我们自己处理
    // 这里主要是为了测试，真是情况下我们可以请求真实的后端，或者免费的API来做请求代理
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({
        message: 'Hello from Worker API!',
        timestamp: new Date().toISOString(),
        path: url.pathname
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 其他请求交给Static Assets处理
    return env.ASSETS.fetch(request);
  },
};