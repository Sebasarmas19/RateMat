const jwt = require('jsonwebtoken');

const SECRET = 'super-secret-jwt-key-from-supabase-replace-me-in-prod';
const BASE_URL = 'http://localhost:3000';

function getHeaders(email, sub) {
  const token = jwt.sign({ email, sub }, SECRET, { expiresIn: '1h' });
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

const crypto = require('crypto');

async function run() {
  console.log('Testing Authentication /users/me');
  const userId = crypto.randomUUID();
  const headers = getHeaders('test@est.ucab.edu.ve', userId);
  
  let res = await fetch(`${BASE_URL}/users/me`, { headers });
  if (res.status !== 200) throw new Error('Auth failed, status: ' + res.status);
  const user = await res.json();
  console.log('User created:', user);

  console.log('\nTesting Daily Rate Limit (Professors)');
  for (let i = 1; i <= 4; i++) {
    const pRes = await fetch(`${BASE_URL}/professors`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: `Profesor Prueba ${Date.now()}` })
    });
    console.log(`Req ${i} status: ${pRes.status}`);
    if (i <= 3 && pRes.status !== 201) {
      console.error(await pRes.text());
      throw new Error('Expected 201 on req ' + i);
    }
    if (i === 4 && pRes.status !== 400 && pRes.status !== 429) {
      throw new Error('Expected 400 or 429 on req 4 for daily limit, got ' + pRes.status);
    }
  }

  console.log('\nTesting Global Throttler (100 reqs/min)');
  let throttleHit = false;
  for (let i = 0; i < 110; i++) {
    const tRes = await fetch(`${BASE_URL}/users/me`, { headers });
    if (tRes.status === 429) {
      throttleHit = true;
      console.log(`Hit 429 Too Many Requests after ${i} requests!`);
      break;
    }
  }
  if (!throttleHit) throw new Error('Throttler did not trigger');
  
  console.log('\nAll tests passed!');
}

run().catch(console.error);
