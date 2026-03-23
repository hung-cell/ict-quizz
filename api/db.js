import { createClient } from '@supabase/supabase-js';
import tunnel from 'tunnel';
import fetch from 'node-fetch';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Configure proxy agent
const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
let agent = undefined;

if (proxyUrl) {
  // Parse proxy URL
  const proxyUrlObj = new URL(proxyUrl);
  
  // Create tunnel agent for HTTPS over HTTP proxy
  agent = tunnel.httpsOverHttp({
    proxy: {
      host: proxyUrlObj.hostname,
      port: parseInt(proxyUrlObj.port) || 8080
    },
    rejectUnauthorized: false
  });
}

// Custom fetch with proxy support
const customFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    agent: agent
  });
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  },
  global: {
    fetch: customFetch
  }
});

export default supabase;
