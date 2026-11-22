import crypto from 'crypto';
import { expect, test } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { generateStrongPassword } from '../utils/userFactory';

test('register a new customer', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const uniqueId = `${Date.now()}_${crypto.randomInt(1000, 9999)}`;

  const userData = {
    first_name: 'Test',
    last_name: 'User',
    dob: '1995-05-15',
    country: 'US',
    postal_code: '90210',
    house_number: '42',
    street: 'Beverly Hills',
    city: 'Los Angeles',
    state: 'CA',
    phone: '1234567890',
    email: `test_user_${uniqueId}@example.com`,
    password: process.env.TEST_USER_PASSWORD || generateStrongPassword(),
  };

  await registerPage.navigate();
  await registerPage.register(userData);

  await expect(page).toHaveURL(/\/auth\/login$/, { timeout: 10000 });
});
