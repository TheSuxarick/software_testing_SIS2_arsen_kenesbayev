from playwright.sync_api import Page

class ResetPasswordPage:
    def __init__(self, page: Page):
        self.page = page
        
        # Локаторы страницы сброса пароля (data-test и семантические роли)
        self.email_input = page.get_by_test_id("email")
        self.submit_button = page.get_by_test_id("forgot-password-submit")
        self.alert_message = page.get_by_role("alert")

    def navigate(self):
        """Перейти на страницу сброса пароля"""
        self.page.goto("https://practicesoftwaretesting.com/auth/forgot-password")
        self.email_input.wait_for(state="visible")

    def request_password_reset(self, email: str):
        """Ввести email и запросить сброс пароля"""
        self.email_input.fill(email)
        self.submit_button.click()
