# AI Prompts Log

**AI Tool Used:** Google Gemini (Gemini 2.5 Flash)

## Overview of AI Usage
I wrote the test cases and Page Object classes for `practicesoftwaretesting.com` myself. I used the AI assistant strictly as a technical reference and debugging partner—first to understand how the Page Object Model (POM) structure works on an abstract example, and later to ask specific syntax and troubleshooting questions while implementing each of the 5 test cases.

---

## 0. Understanding Page Object Model (POM) & Project Setup

### Prompt 1 (Conceptual POM Example):
> "I need to structure my Playwright Python project using the Page Object Model (POM). I don't quite understand how the files in `pages/` and `tests/` should interact with each other or why we separate them. Don't write code for my assignment—just show me a simple abstract example (like searching for a video on YouTube) so I can understand the pattern and write my own classes."

### Prompt 2 (Configuring `data-test` attribute in Pytest):
> "In Python `pytest-playwright`, `get_by_test_id()` looks for `data-testid` by default, but the website I am testing uses `data-test`. How do I globally configure Playwright in `conftest.py` so I don't have to change it in every file?"

---

## 1. Test Case 1: Register a New Customer (`test_1_register.py`)

### Prompt 3 (Unique Email Generation):
> "I am writing my registration test. Every test run needs a unique email address so the backend doesn't reject it as a duplicate. What is the cleanest way in Python to generate a unique email on the fly without hardcoding?"

### Prompt 4 (Debugging Registration Form Validation):
> "My registration test fills out all the inputs and clicks submit, but it stays on `/auth/register` instead of redirecting to `/auth/login`. When I inspected the page during the test run, I saw two alerts: 'Please enter a valid postal code for the selected country' and 'The given password has appeared in a data leak'. Why does the site do this and what format should I use?"

---

## 2. Test Case 2: Log In (`test_2_login.py`)

### Prompt 5 (Account Locking Issue - HTTP 423):
> "While testing my valid and invalid login scenarios using the default demo account, my valid login test suddenly started failing. When I checked the network tab / API response, it returned `HTTP Error 423: Locked`. How can I make my login tests independent so that testing invalid passwords doesn't lock the account for other tests?"

---

## 3. Test Case 3: Buy a Product (`test_3_buy_product.py`)

### Prompt 6 (Interacting with `<select>` and Input Values in Playwright):
> "I'm implementing the checkout flow in my `CheckoutPage` class. I have two quick Playwright syntax questions:
> 1. In the cart table, the product quantity is inside an `<input type='number'>`, not regular text. Which `expect()` assertion checks an input's value?
> 2. On the payment step, how do I select an option from a `<select>` dropdown by its value attribute?"

---

## 4. Test Case 4: Compare Two Products (`test_4_compare_products.py`)

### Prompt 7 (Selecting N-th Elements & Parsing Prices):
> "For my product comparison test, I want to click the first product card on the catalog page, grab its title and price, go back, and click the second product card. Since all cards share `data-test='product-name'`, how do I click a specific card by index in Playwright? Also, what's the cleanest way in Python to strip the `$` sign from the price string so I can compare them as floats?"

---

## 5. Test Case 5: Reset Password (`test_5_reset_password.py`)

### Prompt 8 (Semantic Locators for Alerts):
> "On the forgot-password page, after submitting an email, a confirmation or error box appears (`<div role='alert' class='alert alert-success'>`). My assignment forbids using CSS classes like `.alert-success`, and this element doesn't have a `data-test` attribute. Which semantic locator should I use in Playwright to capture this element and verify its state?"
