import { supabase } from './db.js';
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

    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, email, password, name, created_at')
      .eq('email', email);

    if (fetchError) throw fetchError;

    if (!users || users.length === 0) {
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

    const { error: logError } = await supabase
      .from('login_history')
      .insert({
        user_id: user.id,
        email: user.email,
        ip_address: ipAddress,
        user_agent: userAgent
      });

    if (logError) console.error('Login history error:', logError);

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
