import crypto from 'crypto';

export interface TestUser {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export function generateStrongPassword(): string {
  const randomSuffix = crypto.randomBytes(6).toString('hex');
  return `Xk9#mP2$${randomSuffix}!`;
}

export async function createTestUser(): Promise<TestUser> {
  const uniqueId = `${Date.now()}_${crypto.randomInt(10000, 99999)}`;
  const email = `user_${uniqueId}@testcompany.org`;
  const password = process.env.TEST_USER_PASSWORD || generateStrongPassword();
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const apiBase = process.env.API_URL || `${baseUrl}/api`;

  const payload = {
    first_name: 'Test',
    last_name: 'User',
    dob: '1990-01-01',
    address: {
      street: 'Beverly Hills',
      house_number: '42',
      city: 'Los Angeles',
      state: 'CA',
      country: 'US',
      postal_code: '90210',
    },
    phone: '1234567890',
    email,
    password,
  };

  const response = await fetch(`${apiBase}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to register test user (${response.status}): ${body}`);
  }

  return {
    email,
    password,
    first_name: 'Test',
    last_name: 'User',
  };
}
