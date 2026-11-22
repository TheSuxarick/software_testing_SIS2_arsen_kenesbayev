import { Locator, Page } from '@playwright/test';

export class ResetPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly alertMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email');
    this.submitButton = page.getByTestId('forgot-password-submit');
    this.alertMessage = page.getByRole('alert');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/auth/forgot-password');
    await this.emailInput.waitFor({ state: 'visible' });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
