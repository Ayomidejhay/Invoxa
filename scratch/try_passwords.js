const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envPath = 'C:\\Users\\Pc\\Documents\\Projects\\invoxa\\.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const passwords = [
  'password',
  'password123',
  'Password123!',
  'ayomi123',
  'Ayomide123',
  'Ayomidejhay',
  'Ayomidejhay2001',
  'invoxa',
  'invoxa123',
  'Invoxa123',
  'pvtxxbwyxptywloa'
];

async function run() {
  const email = 'ayomiolaniyan@gmail.com';
  for (const pwd of passwords) {
    console.log(`Trying login for ${email} with password: ${pwd}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pwd
    });
    if (!error) {
      console.log(`SUCCESS! Password is: ${pwd}`);
      console.log('Session:', data.session);
      return;
    } else {
      console.log(`Failed: ${error.message}`);
    }
  }
  console.log('All passwords failed.');
}

run();
