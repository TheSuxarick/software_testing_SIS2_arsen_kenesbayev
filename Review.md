# AI Responses Review & Implementation Decisions

This document explains what the AI suggested in response to my technical questions, the mistakes/limitations I found in its suggestions, and how I adapted and implemented the final solution in my own code.

---

## 0. Page Object Model Concept & Global `conftest.py` Setup

* **What the AI suggested:**  
  1. It showed a basic example of a `YouTubeSearchPage` class and a test file to demonstrate how locators and actions stay in `pages/` while assertions stay in `tests/`. Once I understood the logic, I designed the 5 Page Object classes for `practicesoftwaretesting.com` myself.
  2. For configuring `data-test`, the AI initially told me to write:
     ```python
     from playwright.sync_api import selectors
     selectors.set_test_id_attribute("data-test")
     ```
* **Issue Found & My Fix:**  
  When I ran `pytest`, it immediately crashed with `ImportError: cannot import name 'selectors' from 'playwright.sync_api'`. I checked the `pytest-playwright` documentation and realized `selectors` is a property on the `Playwright` fixture instance, not a standalone module. I fixed `conftest.py` by injecting `playwright: Playwright` into the session fixture:
  ```python
  @pytest.fixture(scope="session", autouse=True)
  def configure_test_id(playwright: Playwright):
      playwright.selectors.set_test_id_attribute("data-test")
  ```

---

## 1. Test Case 1: Register a New Customer (`test_1_register.py`)

* **What the AI suggested:**  
  1. For unique emails, it suggested either installing `Faker` or using `int(time.time())` in an f-string (`f"test_user_{unique_id}@example.com"`). I chose the timestamp approach because it is lightweight and guarantees uniqueness on every run.
  2. When I asked about old documentation mentioning `data-test="address"` and `postcode`, and why my form submission failed, the AI explained that the site validates country-specific postal codes and checks passwords against the HaveIBeenPwned breach API.
* **How I reviewed and applied it:**  
  I inspected the live DOM of `/auth/register` myself and saw that the site had been updated to v2.5, splitting the address into `postal_code`, `house_number`, and `street`. I updated my `RegisterPage` locators accordingly, set the country to `"US"` with a valid 5-digit zip code (`"90210"`), and replaced the generic password with a complex custom string (`"Xk9#mP2$vL8@qZ5!"`) so it wouldn't trigger the data-leak check.

---

## 2. Test Case 2: Log In (`test_2_login.py`)

* **What the AI suggested:**  
  When I hit `HTTP 423: Locked` on the shared `customer@practicesoftwaretesting.com` account after testing invalid logins, the AI suggested creating a fresh user before each test by calling the backend REST API (`POST https://api.practicesoftwaretesting.com/users/register`).
* **Issue Found & My Fix:**  
  The AI initially gave me a flat JSON payload for the API request (`"address": "Street 1"`), which returned `HTTP 422: Unprocessable Content (The address field must be an array/object)`. I inspected the actual network request in Chrome DevTools when registering on the frontend, saw the nested `address` JSON structure, and wrote `utils/user_factory.py` using Python's built-in `urllib.request`. Now every test creates its own isolated user in ~0.2 seconds, completely solving the `423 Locked` problem.

---

## 3. Test Case 3: Buy a Product (`test_3_buy_product.py`)

* **What the AI suggested:**  
  The AI answered my syntax questions by pointing me to `expect(locator).to_have_value("1")` for checking `<input>` values in the cart, and `.select_option("cash-on-delivery")` for the payment dropdown.
* **How I reviewed and applied it:**  
  While writing `CheckoutPage` and running the test in `--headed --slowmo 500` mode, I noticed two practical issues that I fixed myself:
  1. On Step 3 (Billing Address), the `proceed-3` button stayed `disabled` even for a logged-in user because the frontend form left `postal_code`, `house_number`, and `state` blank. I added explicit `.fill()` calls in `complete_address_step()` to enable the button.
  2. At one point I accidentally duplicated the checkout call block in my test file, which caused the quantity in the cart to become `2` instead of `1`. Running the test in headed mode helped me spot and remove the duplicate lines immediately.

---

## 4. Test Case 4: Compare Two Products (`test_4_compare_products.py`)

* **What the AI suggested:**  
  It showed me how to use `.nth(index)` on a locator collection (`self.product_names.nth(index).click()`) and suggested `float(price_text.replace("$", "").strip())` to convert the price string into a number.
* **How I reviewed and applied it:**  
  I integrated this into `ProductPage.get_product_details()`, which returns a clean dictionary `{"name": ..., "price": ...}`. In `test_4_compare_products.py`, I opened the first two catalog items (`index 0` and `index 1`) and wrote assertions verifying that both names are non-empty, the products are distinct, both prices are positive, and their price difference is greater than zero.

---

## 5. Test Case 5: Reset Password (`test_5_reset_password.py`)

* **What the AI suggested:**  
  In response to my question about avoiding CSS classes, the AI recommended `page.get_by_role("alert")`.
* **How I reviewed and applied it:**  
  I verified in DevTools that both the green confirmation box and the red error box on `/auth/forgot-password` use `<div role="alert">`. I used `page.get_by_role("alert")` in `ResetPasswordPage`, and in `test_5_reset_password.py` I used my `create_test_user()` factory for the positive case and a non-existent email for the negative case (`"The selected email is invalid"`).
