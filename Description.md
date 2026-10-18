# Project Description — SIS 2 (Playwright Test Automation)

This repository contains automated End-to-End (E2E) tests for the [Practice Software Testing](https://practicesoftwaretesting.com/) web application, built with **Python**, **Pytest**, and **Playwright** (`pytest-playwright`).

The project strictly follows the **Page Object Model (POM)** architecture, separating page locators and interactions (`pages/`) from test scenarios and assertions (`tests/`).

---

## Automated Test Cases

1. **Register a New Customer (`tests/test_1_register.py`)**
   - Generates a unique email address using a timestamp on every run.
   - Fills out the registration form (`postal_code`, `house_number`, `street`, country, etc.) using a strong password that passes the site's data-leak check.
   - Asserts successful redirection to `/auth/login`.

2. **Log In (`tests/test_2_login.py`)**
   - **Valid Login:** Signs in with an isolated test user created via the data factory and verifies redirection to `/account` and the `"My account"` page title.
   - **Invalid Login:** Attempts to sign in with an incorrect password and verifies that the `"Invalid email or password"` error message is visible.

3. **Buy a Product (`tests/test_3_buy_product.py`)**
   - Completes a full checkout flow: logs in $\rightarrow$ selects a product from the catalog $\rightarrow$ adds it to the cart $\rightarrow$ verifies the product title and quantity (`1`) in the cart $\rightarrow$ completes the sign-in, billing address, and payment (`cash-on-delivery`) steps $\rightarrow$ asserts the `"Payment was successful"` confirmation message.

4. **Compare Two Products (`tests/test_4_compare_products.py`)**
   - Opens two different products from the catalog (`index 0` and `index 1`), extracts their names and unit prices, and asserts that their titles are distinct, prices are positive, and the price difference is valid.

5. **Reset Password (`tests/test_5_reset_password.py`)**
   - **Existing Email:** Requests a password reset for a registered user and verifies the confirmation alert (`role="alert"`).
   - **Invalid/Non-existent Email:** Submits an unregistered email address and verifies the `"The selected email is invalid"` error alert.

---

## Key Architectural Decisions

- **Page Object Model (POM):** No raw locators are used inside `tests/`. All element selectors and page actions are encapsulated inside `pages/`.
- **Resilient Locators:** Configured `playwright.selectors.set_test_id_attribute("data-test")` in `conftest.py` so all pages use `page.get_by_test_id()` and semantic locators like `page.get_by_role("alert")`.
- **Test Isolation (`utils/user_factory.py`):** Created a test data factory that registers a fresh user via the backend API before tests that require an account. This prevents `HTTP 423: Locked` errors on shared demo accounts and allows tests to run in any order.
- **No Hard Waits:** Zero `time.sleep()` calls; all synchronization relies on Playwright's built-in auto-waiting and web-first assertions (`expect()`).

---

## How to Run Locally

1. **Create and activate a virtual environment:**
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

2. **Install dependencies and browser binaries:**
   ```powershell
   pip install -r requirements.txt
   playwright install chromium
   ```

3. **Run the test suite:**
   ```powershell
   # Headless mode (fast):
   pytest tests/

   # Headed mode with slow motion (visual):
   pytest tests/ --headed --slowmo 500
   ```