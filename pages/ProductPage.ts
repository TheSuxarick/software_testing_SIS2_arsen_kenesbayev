import { Locator, Page } from '@playwright/test';

export interface ProductDetails {
  name: string;
  price: number;
}

export class ProductPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly detailName: Locator;
  readonly detailPrice: Locator;
  readonly addToCartButton: Locator;
  readonly cartLink: Locator;
  readonly cartQuantityBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('.card');
    this.productNames = page.getByTestId('product-name');
    this.productPrices = page.getByTestId('product-price');
    this.detailName = page.getByTestId('product-name');
    this.detailPrice = page.getByTestId('unit-price');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.cartLink = page.getByTestId('nav-cart');
    this.cartQuantityBadge = page.getByTestId('cart-quantity');
  }

  async navigateHome(): Promise<void> {
    await this.page.goto('/');
    await this.productNames.first().waitFor({ state: 'visible' });
  }

  async openProductByIndex(index = 0): Promise<void> {
    await this.productNames.nth(index).click();
    await this.addToCartButton.waitFor({ state: 'visible' });
  }

  async getProductDetails(): Promise<ProductDetails> {
    const name = (await this.detailName.innerText()).trim();
    const rawPrice = (await this.detailPrice.innerText()).replace('$', '').trim();
    return {
      name,
      price: parseFloat(rawPrice),
    };
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await this.cartQuantityBadge.waitFor({ state: 'visible' });
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}
