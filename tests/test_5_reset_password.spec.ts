import { expect, test } from '@playwright/test';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { createTestUser } from '../utils/userFactory';

test('reset password for existing email', async ({ page }) => {
  const user = await createTestUser();
  const resetPage = new ResetPasswordPage(page);

  await resetPage.navigate();
  await resetPage.requestPasswordReset(user.email);

  await expect(resetPage.alertMessage).toBeVisible({ timeout: 10000 });
  await expect(resetPage.alertMessage).toHaveClass('alert alert-success mt-3');
});

test('reset password fails for invalid email', async ({ page }) => {
  const resetPage = new ResetPasswordPage(page);

  await resetPage.navigate();
  await resetPage.requestPasswordReset('nonexistent_user_999999@test.com');

  await expect(resetPage.alertMessage).toBeVisible({ timeout: 10000 });
  await expect(resetPage.alertMessage).toContainText('The selected email is invalid');
});
