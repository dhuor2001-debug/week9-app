const http = require('http');
const { spawn } = require('child_process');

const server = spawn('node', ['server.js'], { env: { ...process.env, PORT: 3999 } });

function check(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3999${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

setTimeout(async () => {
  try {
    const health = await check('/health');
    if (health.status !== 200) throw new Error('Health check failed');
    console.log('✅ Health check passed');

    const products = await check('/api/products');
    const parsed = JSON.parse(products.body);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Products endpoint returned no data');
    console.log(`✅ Products endpoint returned ${parsed.length} items`);

    server.kill();
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    server.kill();
    process.exit(1);
  }
}, 1000);