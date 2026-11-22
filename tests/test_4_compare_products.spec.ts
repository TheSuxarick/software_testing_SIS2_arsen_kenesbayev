import { expect, test } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';

test('compare two different products', async ({ page }) => {
  const productPage = new ProductPage(page);

  // 1. Open first product
  await productPage.navigateHome();
  await productPage.openProductByIndex(0);
  const product1 = await productPage.getProductDetails();

  // 2. Return to catalog and open second product
  await productPage.navigateHome();
  await productPage.openProductByIndex(1);
  const product2 = await productPage.getProductDetails();

  // 3. Assert names are non-empty and distinct
  expect(product1.name.length).toBeGreaterThan(0);
  expect(product2.name.length).toBeGreaterThan(0);
  expect(product1.name).not.toBe(product2.name);

  // 4. Assert prices are valid and distinct
  expect(product1.price).toBeGreaterThan(0);
  expect(product2.price).toBeGreaterThan(0);
  expect(product1.price).not.toBe(product2.price);

  const priceDifference = Math.round(Math.abs(product1.price - product2.price) * 100) / 100;
  expect(priceDifference).toBeGreaterThan(0);
});
