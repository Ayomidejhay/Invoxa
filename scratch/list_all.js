const anonKey = 'sb_publishable_8OAF8rcKSfUCJLSSnXj85Q_q0uTnB6p';
const headers = {
  'apikey': anonKey,
  'Authorization': `Bearer ${anonKey}`
};

async function run() {
  try {
    // 1. Fetch orgs
    const orgsRes = await fetch('https://muvypawaelgilfnorqll.supabase.co/rest/v1/organizations?limit=10', { headers });
    const orgs = await orgsRes.json();
    console.log('ORGANIZATIONS:', orgs);

    // 2. Fetch customers
    const custsRes = await fetch('https://muvypawaelgilfnorqll.supabase.co/rest/v1/customers?limit=10', { headers });
    const custs = await custsRes.json();
    console.log('CUSTOMERS:', custs);

    // 3. Fetch invoices
    const invsRes = await fetch('https://muvypawaelgilfnorqll.supabase.co/rest/v1/invoices?limit=10', { headers });
    const invs = await invsRes.json();
    console.log('INVOICES:', invs);
  } catch (err) {
    console.error(err);
  }
}

run();
