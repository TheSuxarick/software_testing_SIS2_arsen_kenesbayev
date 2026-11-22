import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { createTestUser } from '../utils/userFactory';

test('login success with valid credentials', async ({ page }) => {
  const user = await createTestUser();
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(user.email, user.password);

  await expect(page).toHaveURL(/\/account$/, { timeout: 10000 });
  await expect(loginPage.accountPageTitle).toContainText('My account');
});

test('login fails with invalid password', async ({ page }) => {
  const user = await createTestUser();
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login(user.email, 'wrong_password_123');

  await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });
  await expect(loginPage.errorMessage).toContainText('Invalid email or password');
});
