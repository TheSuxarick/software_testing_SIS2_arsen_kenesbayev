import { Locator, Page } from '@playwright/test';

export interface RegisterUserData {
  first_name: string;
  last_name: string;
  dob: string;
  country: string;
  postal_code: string;
  house_number: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
}

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dobInput: Locator;
  readonly countrySelect: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.dobInput = page.getByTestId('dob');
    this.countrySelect = page.getByTestId('country');
    this.postalCodeInput = page.getByTestId('postal_code');
    this.houseNumberInput = page.getByTestId('house_number');
    this.streetInput = page.getByTestId('street');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');
    this.phoneInput = page.getByTestId('phone');
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.registerButton = page.getByTestId('register-submit');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/auth/register');
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async register(userData: RegisterUserData): Promise<void> {
    await this.firstNameInput.fill(userData.first_name);
    await this.lastNameInput.fill(userData.last_name);
    await this.dobInput.fill(userData.dob);
    await this.countrySelect.selectOption(userData.country);
    await this.postalCodeInput.fill(userData.postal_code);
    await this.houseNumberInput.fill(userData.house_number);
    await this.streetInput.fill(userData.street);
    await this.cityInput.fill(userData.city);
    await this.stateInput.fill(userData.state);
    await this.phoneInput.fill(userData.phone);
    await this.emailInput.fill(userData.email);
    await this.passwordInput.fill(userData.password);
    await this.registerButton.click();
  }
}
