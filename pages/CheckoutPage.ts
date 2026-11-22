import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productQuantity: Locator;
  readonly proceed1Button: Locator;
  readonly proceed2Button: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly stateInput: Locator;
  readonly proceed3Button: Locator;
  readonly paymentMethodSelect: Locator;
  readonly finishButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.getByTestId('product-title');
    this.productQuantity = page.getByTestId('product-quantity');
    this.proceed1Button = page.getByTestId('proceed-1');
    this.proceed2Button = page.getByTestId('proceed-2');
    this.postalCodeInput = page.getByTestId('postal_code');
    this.houseNumberInput = page.getByTestId('house_number');
    this.stateInput = page.getByTestId('state');
    this.proceed3Button = page.getByTestId('proceed-3');
    this.paymentMethodSelect = page.getByTestId('payment-method');
    this.finishButton = page.getByTestId('finish');
    this.successMessage = page.getByTestId('payment-success-message');
  }

  async proceedFromCart(): Promise<void> {
    await this.proceed1Button.click();
  }

  async confirmSignInStep(): Promise<void> {
    await this.proceed2Button.click();
  }

  async completeAddressStep(
    postalCode = '1010',
    houseNumber = '1',
    state = 'Vienna',
  ): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
    await this.houseNumberInput.fill(houseNumber);
    await this.stateInput.fill(state);
    await this.proceed3Button.click();
  }

  async payAndFinish(method = 'cash-on-delivery'): Promise<void> {
    await this.paymentMethodSelect.selectOption(method);
    await this.finishButton.click();
  }
}
