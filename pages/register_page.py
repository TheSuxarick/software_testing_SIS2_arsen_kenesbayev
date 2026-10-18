from playwright.sync_api import Page

class RegisterPage:
    def __init__(self, page: Page):
        self.page = page
        
        # Локаторы страницы регистрации (по актуальным data-test сайта)
        self.first_name_input = page.get_by_test_id("first-name")
        self.last_name_input = page.get_by_test_id("last-name")
        self.dob_input = page.get_by_test_id("dob")
        self.country_select = page.get_by_test_id("country")
        self.postal_code_input = page.get_by_test_id("postal_code")
        self.house_number_input = page.get_by_test_id("house_number")
        self.street_input = page.get_by_test_id("street")
        self.city_input = page.get_by_test_id("city")
        self.state_input = page.get_by_test_id("state")
        self.phone_input = page.get_by_test_id("phone")
        self.email_input = page.get_by_test_id("email")
        self.password_input = page.get_by_test_id("password")
        self.register_button = page.get_by_test_id("register-submit")

    def navigate(self):
        """Перейти на страницу регистрации и дождаться загрузки формы"""
        self.page.goto("https://practicesoftwaretesting.com/auth/register")
        self.first_name_input.wait_for(state="visible")

    def register(self, user_data: dict):
        """Заполнить всю форму регистрации и отправить её"""
        self.first_name_input.fill(user_data["first_name"])
        self.last_name_input.fill(user_data["last_name"])
        self.dob_input.fill(user_data["dob"])
        self.country_select.select_option(user_data["country"])
        self.postal_code_input.fill(user_data["postal_code"])
        self.house_number_input.fill(user_data["house_number"])
        self.street_input.fill(user_data["street"])
        self.city_input.fill(user_data["city"])
        self.state_input.fill(user_data["state"])
        self.phone_input.fill(user_data["phone"])
        self.email_input.fill(user_data["email"])
        self.password_input.fill(user_data["password"])
        
        self.register_button.click()