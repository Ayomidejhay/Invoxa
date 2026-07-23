const url = 'https://muvypawaelgilfnorqll.supabase.co/rest/v1/invoices?select=id,status,invoice_number,pricing_options,selected_pricing_option&limit=10';
const anonKey = 'sb_publishable_8OAF8rcKSfUCJLSSnXj85Q_q0uTnB6p';

async function run() {
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

run();
