const http = require('http');
const { spawn } = require('child_process');

const server = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: 3999 },
  stdio: ['ignore', 'pipe', 'pipe']
});

server.stdout.on('data', d => process.stdout.write(`[server] ${d}`));
server.stderr.on('data', d => process.stderr.write(`[server-err] ${d}`));

server.on('error', (err) => {
  console.error('❌ Failed to spawn server process:', err);
  process.exit(1);
});

function check(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3999${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function waitForServer(retries = 10, delayMs = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await check('/health');
    } catch (err) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('Server did not become ready in time');
}

(async () => {
  try {
    const health = await waitForServer();
    if (health.status !== 200) throw new Error('Health check failed');
    console.log('✅ Health check passed');

    const products = await check('/api/products');
    const parsed = JSON.parse(products.body);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Products endpoint returned no data');
    console.log(`✅ Products endpoint returned ${parsed.length} items`);

    server.kill();
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    server.kill();
    process.exit(1);
  }
})();