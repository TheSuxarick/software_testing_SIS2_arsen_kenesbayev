import { expect, test } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { createTestUser } from '../utils/userFactory';

test('complete product purchase flow', async ({ page }) => {
  const user = await createTestUser();
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const checkoutPage = new CheckoutPage(page);

  // 1. Log in before purchasing
  await loginPage.navigate();
  await loginPage.login(user.email, user.password);
  await expect(page).toHaveURL(/\/account$/, { timeout: 10000 });

  // 2. Select a product from the catalog
  await productPage.navigateHome();
  await productPage.openProductByIndex(0);
  const details = await productPage.getProductDetails();

  // 3. Add to cart and navigate to checkout
  await productPage.addToCart();
  await productPage.goToCart();
  await expect(page).toHaveURL(/\/checkout$/);

  // 4. Verify cart contents
  await expect(checkoutPage.productTitle).toContainText(details.name);
  await expect(checkoutPage.productQuantity).toHaveValue('1');

  // 5. Complete checkout steps
  await checkoutPage.proceedFromCart();
  await checkoutPage.confirmSignInStep();
  await checkoutPage.completeAddressStep('90210', '42', 'CA');
  await checkoutPage.payAndFinish('cash-on-delivery');

  // 6. Verify payment confirmation
  await expect(checkoutPage.successMessage).toBeVisible({ timeout: 10000 });
  await expect(checkoutPage.successMessage).toContainText('Payment was successful');
});
