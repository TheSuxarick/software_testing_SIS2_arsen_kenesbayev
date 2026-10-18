from playwright.sync_api import Page, expect
from pages.login_page import LoginPage
from utils.user_factory import create_test_user

def test_login_success(page: Page):
    """Проверка успешной авторизации с валидными данными"""
    user = create_test_user()
    login_page = LoginPage(page)

    login_page.navigate()
    login_page.login(user["email"], user["password"])

    # Проверяем переход в личный кабинет и наличие заголовка
    expect(page).to_have_url("https://practicesoftwaretesting.com/account", timeout=10000)
    expect(login_page.account_page_title).to_contain_text("My account")

def test_login_invalid_password(page: Page):
    """Проверка ошибки при неверном пароле"""
    user = create_test_user()
    login_page = LoginPage(page)

    login_page.navigate()
    login_page.login(user["email"], "wrong_password_123")

    # Проверяем появление сообщения об ошибке
    expect(login_page.error_message).to_be_visible(timeout=10000)
    expect(login_page.error_message).to_contain_text("Invalid email or password")