import { Client } from 'pg';

export async function handler(event) {
  const DATABASE_URL = process.env.DATABASE_URL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

  if (!DATABASE_URL) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing DATABASE_URL env var' }) };
  }

  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  try {
    await client.query(`CREATE TABLE IF NOT EXISTS tickets (number integer PRIMARY KEY, sold boolean NOT NULL DEFAULT false)`);

    if (event.httpMethod === 'GET') {
      const res = await client.query('SELECT number FROM tickets WHERE sold = true');
      const sold = res.rows.map(r => r.number);
      await client.end();
      return { statusCode: 200, body: JSON.stringify({ sold }) };
    }

    if (event.httpMethod === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      const { number, action, password } = body;

      if (ADMIN_PASSWORD && password !== ADMIN_PASSWORD) {
        await client.end();
        return { statusCode: 403, body: JSON.stringify({ error: 'Unauthorized' }) };
      }

      if (typeof number !== 'number' || !action) {
        await client.end();
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid payload' }) };
      }

      if (action === 'sell') {
        await client.query('INSERT INTO tickets(number, sold) VALUES($1, true) ON CONFLICT (number) DO UPDATE SET sold = true', [number]);
      } else if (action === 'release') {
        await client.query('INSERT INTO tickets(number, sold) VALUES($1, false) ON CONFLICT (number) DO UPDATE SET sold = false', [number]);
      } else {
        await client.end();
        return { statusCode: 400, body: JSON.stringify({ error: 'Unknown action' }) };
      }

      await client.end();
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    await client.end();
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err) {
    await client.end();
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
