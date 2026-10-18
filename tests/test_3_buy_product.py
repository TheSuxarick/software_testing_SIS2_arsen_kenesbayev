from playwright.sync_api import Page, expect
from pages.login_page import LoginPage
from pages.product_page import ProductPage
from pages.checkout_page import CheckoutPage
from utils.user_factory import create_test_user

def test_complete_product_purchase(page: Page):
    """
    Тест-кейс 3: Полный цикл покупки товара
    1. Авторизация изолированным пользователем
    2. Добавление товара в корзину
    3. Проверка товара и количества в корзине
    4. Оформление заказа и успешная оплата
    """
    user = create_test_user()
    login_page = LoginPage(page)
    product_page = ProductPage(page)
    checkout_page = CheckoutPage(page)

    # 1. Авторизуемся перед покупкой
    login_page.navigate()
    login_page.login(user["email"], user["password"])
    expect(page).to_have_url("https://practicesoftwaretesting.com/account", timeout=10000)

    # 2. Выбираем товар в каталоге
    product_page.navigate_home()
    product_page.open_product_by_index(0)
    details = product_page.get_product_details()
    expected_title = details["name"]

    # 3. Добавляем в корзину и переходим в чекаут
    product_page.add_to_cart()
    product_page.go_to_cart()
    expect(page).to_have_url("https://practicesoftwaretesting.com/checkout")

    # 4. Проверка содержимого корзины (Assertions)
    expect(checkout_page.product_title).to_contain_text(expected_title)
    expect(checkout_page.product_quantity).to_have_value("1")

    # 5. Прохождение шагов оформления заказа
    checkout_page.proceed_from_cart()
    checkout_page.confirm_sign_in_step()
    checkout_page.complete_address_step(postal_code="90210", house_number="42", state="CA")
    checkout_page.pay_and_finish(method="cash-on-delivery")

    # 6. Финальная проверка успешного завершения заказа
    expect(checkout_page.success_message).to_be_visible(timeout=10000)
    expect(checkout_page.success_message).to_contain_text("Payment was successful")

