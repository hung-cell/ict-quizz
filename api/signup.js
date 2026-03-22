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
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (email, password, name)
      VALUES (${email}, ${hashedPassword}, ${name || null})
      RETURNING id, email, name, created_at
    `;

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: result[0]
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Email already exists'
      });
    }

    return res.status(500).json({
      error: error.message
    });
  }
}