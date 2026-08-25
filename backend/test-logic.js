const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const client = new Client({ user: 'postgres', password: 'gomitas', database: 'ratemat', port: 5432, host: 'localhost' });
const SECRET = 'super-secret-jwt-key-from-supabase-replace-me-in-prod';
const BASE_URL = 'http://localhost:3000';

function getHeaders(userId) {
  const token = jwt.sign({ email: `test-${userId}@est.ucab.edu.ve`, sub: userId }, SECRET, { expiresIn: '1h' });
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function doQuery() {
  await client.connect();
  let sub = await client.query("INSERT INTO subjects (name, code, credits) VALUES ('Matematica', 'MAT101', 5) ON CONFLICT (code) DO UPDATE SET name=EXCLUDED.name RETURNING id;");
  let prof = await client.query("INSERT INTO professors (name, status) VALUES ('Albert Einstein', 'APPROVED') RETURNING id;");
  let profSub = await client.query("INSERT INTO professor_subjects (professor_id, subject_id, status) VALUES ($1, $2, 'APPROVED') RETURNING id;", [prof.rows[0].id, sub.rows[0].id]);
  const psId = profSub.rows[0].id;
  
  const userId = crypto.randomUUID();
  const headers = getHeaders(userId);
  await fetch(`${BASE_URL}/users/me`, { headers });

  console.log('Testing Profanity Filter');
  const r1 = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST', headers,
    body: JSON.stringify({ professorSubjectId: psId, rating: 1, text: 'es un maldito profesor' })
  });
  console.log('Profanity Status:', r1.status); // Expect 400
  if (r1.status !== 400) throw new Error('Profanity filter failed');

  console.log('Testing Normal Review');
  const r2 = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST', headers,
    body: JSON.stringify({ professorSubjectId: psId, rating: 5, text: 'Excelente profesor' })
  });
  console.log('Normal Review Status:', r2.status); // Expect 201
  if (r2.status !== 201) throw new Error('Normal review failed');
  const review = await r2.json();
  
  console.log('Testing Voting Logic');
  // Need another user to vote
  const u2 = crypto.randomUUID();
  const h2 = getHeaders(u2);
  await fetch(`${BASE_URL}/users/me`, { headers: h2 });
  
  const v1 = await fetch(`${BASE_URL}/reviews/${review.id}/vote`, {
    method: 'POST', headers: h2, body: JSON.stringify({ voteType: 'DOWN' })
  });
  console.log('Vote 1 DOWN Status:', v1.status); // Expect 201
  let currentReview = await client.query("SELECT * FROM reviews WHERE id=$1", [review.id]);
  console.log('Net Score after 1 DOWN:', currentReview.rows[0].netScore || currentReview.rows[0].netscore); // Expect -1
  
  console.log('Testing Threshold to lower weight');
  for(let i=0; i<4; i++) {
     let ut = crypto.randomUUID();
     let ht = getHeaders(ut);
     await fetch(`${BASE_URL}/users/me`, { headers: ht });
     await fetch(`${BASE_URL}/reviews/${review.id}/vote`, {
       method: 'POST', headers: ht, body: JSON.stringify({ voteType: 'DOWN' })
     });
  }
  currentReview = await client.query("SELECT * FROM reviews WHERE id=$1", [review.id]);
  console.log('Net Score after 5 DOWNs:', currentReview.rows[0].netScore || currentReview.rows[0].netscore, 'Weight:', currentReview.rows[0].weight); // Expect netScore -5, weight 0
  
  console.log('Testing Report System (3 reports hide review)');
  for(let i=0; i<3; i++) {
     let ut = crypto.randomUUID();
     let ht = getHeaders(ut);
     await fetch(`${BASE_URL}/users/me`, { headers: ht });
     await fetch(`${BASE_URL}/reports`, {
       method: 'POST', headers: ht, body: JSON.stringify({ entityType: 'REVIEW', entityId: review.id, reason: 'Spam' })
     });
  }
  currentReview = await client.query("SELECT * FROM reviews WHERE id=$1", [review.id]);
  console.log('Review Status after 3 reports:', currentReview.rows[0].status); // Expect HIDDEN

  await client.end();
  console.log('All logic tests passed!');
}
doQuery().catch(console.error);
