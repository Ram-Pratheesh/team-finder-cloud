const API_URL = 'http://localhost:3000';

async function testAdmin() {
  console.log('Logging in as admin...');
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@teamfinder.com', password: 'Admin@123' })
  });

  if (!loginRes.ok) {
    console.error('Login failed:', await loginRes.text());
    return;
  }

  const { token } = await loginRes.json();
  console.log('Got token, fetching users...');

  const usersRes = await fetch(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!usersRes.ok) {
    console.error('Users API failed:', usersRes.status, await usersRes.text());
    return;
  }

  const data = await usersRes.json();
  console.log('Success! Users returned:', data.users ? data.users.length : 'undefined array', data);
  if (data.users && data.users.length > 0) {
    console.log('Sample user:', JSON.stringify(data.users[0], null, 2));
  }
}

testAdmin();
