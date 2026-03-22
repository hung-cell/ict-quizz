import sql from './db.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const users = await sql`
      SELECT id, email, password, name, created_at
      FROM users
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await sql`
      INSERT INTO login_history (user_id, email, ip_address, user_agent)
      VALUES (${user.id}, ${user.email}, ${ipAddress}, ${userAgent})
    `;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: error.message
    });
  }
}