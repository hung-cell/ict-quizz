import { createClient } from '@supabase/supabase-js';
import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Configure proxy agent
const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
let agent = undefined;

if (proxyUrl) {
  agent = new HttpsProxyAgent(proxyUrl);
}

// Custom fetch with proxy support
const customFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    agent: agent
  });
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    },
    global: {
      fetch: customFetch
    }
  }
);

async function initDatabase() {
  try {
    console.log('Connecting to Supabase via proxy...');
    console.log('Proxy:', proxyUrl);
    
    // Test connection
    const { data, error: testError } = await supabase.from('users').select('*').limit(1);
    
    if (testError && testError.code === '42P01') {
      console.log('⚠️ Tables do not exist yet.');
      console.log('\n📋 Please create tables in Supabase Dashboard:');
      console.log('URL: https://supabase.com/dashboard/project/ggbbwsgphowjxliklarz');
    } else if (testError) {
      throw testError;
    } else {
      console.log('✅ Database connection successful!');
      console.log('✅ Tables already exist');
    }
    
    console.log('\n🎉 Supabase configured successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

initDatabase();
