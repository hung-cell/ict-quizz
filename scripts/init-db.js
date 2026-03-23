import { neon } from '@neondatabase/serverless';
import { ProxyAgent } from 'undici';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Configure proxy agent
const proxyUrl = process.env.HTTP_PROXY || process.env.http_proxy;
let dispatcher = undefined;

if (proxyUrl) {
  dispatcher = new ProxyAgent(proxyUrl);
}

const sql = neon(process.env.DATABASE_URL, { fetchOptions: { dispatcher } });

async function initDatabase() {
  try {
    console.log('Connecting to database via proxy...');
    console.log('Proxy:', proxyUrl);
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Users table created');

    // Create login_history table
    await sql`
      CREATE TABLE IF NOT EXISTS login_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        email VARCHAR(255),
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(50),
        user_agent TEXT
      )
    `;
    console.log('✅ Login history table created');

    console.log('\n🎉 Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

initDatabase();
