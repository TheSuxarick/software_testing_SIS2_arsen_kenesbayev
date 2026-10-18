from playwright.sync_api import Page, expect
from pages.reset_password_page import ResetPasswordPage
from utils.user_factory import create_test_user

def test_reset_password_existing_email(page: Page):
    """
    Тест-кейс 5 (часть 1): Сброс пароля для существующего пользователя.
    Должно появляться подтверждающее уведомление об успешной отправке.
    """
    user = create_test_user()
    reset_page = ResetPasswordPage(page)

    reset_page.navigate()
    reset_page.request_password_reset(user["email"])

    # Проверяем появление алерта с подтверждением
    expect(reset_page.alert_message).to_be_visible(timeout=10000)
    expect(reset_page.alert_message).to_have_class("alert alert-success mt-3")

def test_reset_password_invalid_email(page: Page):
    """
    Тест-кейс 5 (часть 2): Сброс пароля для несуществующего / невалидного email.
    Должно появляться сообщение об ошибке валидации.
    """
    reset_page = ResetPasswordPage(page)

    reset_page.navigate()
    reset_page.request_password_reset("nonexistent_user_999999@test.com")

    # Проверяем появление сообщения об ошибке
    expect(reset_page.alert_message).to_be_visible(timeout=10000)
    expect(reset_page.alert_message).to_contain_text("The selected email is invalid")
