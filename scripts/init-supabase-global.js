import { bootstrap } from 'global-agent';
bootstrap();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

async function initDatabase() {
  try {
    console.log('Connecting to Supabase via global-agent proxy...');
    console.log('Proxy:', process.env.GLOBAL_AGENT_HTTP_PROXY);
    
    // Test connection
    const { data, error: testError } = await supabase.from('users').select('*').limit(1);
    
    if (testError && testError.code === '42P01') {
      console.log('⚠️ Tables do not exist yet.');
      console.log('\n📋 Please create tables in Supabase Dashboard:');
      console.log('URL: https://supabase.com/dashboard/project/ggbbwsgphowjxliklarz');
      console.log('\nTable: users');
      console.log('  - id: int8 (primary key)');
      console.log('  - email: varchar (unique)');
      console.log('  - password: varchar');
      console.log('  - name: varchar');
      console.log('  - created_at: timestamp (default: now())');
      console.log('\nTable: login_history');
      console.log('  - id: int8 (primary key)');
      console.log('  - user_id: int8 (foreign key → users.id)');
      console.log('  - email: varchar');
      console.log('  - login_time: timestamp (default: now())');
      console.log('  - ip_address: varchar');
      console.log('  - user_agent: text');
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
