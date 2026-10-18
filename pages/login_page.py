from playwright.sync_api import Page

class LoginPage:
    def __init__(self, page: Page):
        self.page = page
        
        # Локаторы страницы логина (data-test)
        self.email_input = page.get_by_test_id("email")
        self.password_input = page.get_by_test_id("password")
        self.login_button = page.get_by_test_id("login-submit")
        self.error_message = page.get_by_test_id("login-error")
        self.account_page_title = page.get_by_test_id("page-title")

    def navigate(self):
        """Перейти на страницу логина"""
        self.page.goto("https://practicesoftwaretesting.com/auth/login")
        self.email_input.wait_for(state="visible")

    def login(self, email: str, password: str):
        """Ввести email, пароль и нажать кнопку входа"""
        self.email_input.fill(email)
        self.password_input.fill(password)
        self.login_button.click()