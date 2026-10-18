from playwright.sync_api import Page

class CheckoutPage:
    def __init__(self, page: Page):
        self.page = page
        
        # Корзина
        self.product_title = page.get_by_test_id("product-title")
        self.product_quantity = page.get_by_test_id("product-quantity")
        self.proceed_1_button = page.get_by_test_id("proceed-1")
        
        # Шаг 2 (Авторизация)
        self.proceed_2_button = page.get_by_test_id("proceed-2")
        
        # Шаг 3 (Адрес доставки)
        self.postal_code_input = page.get_by_test_id("postal_code")
        self.house_number_input = page.get_by_test_id("house_number")
        self.state_input = page.get_by_test_id("state")
        self.proceed_3_button = page.get_by_test_id("proceed-3")
        
        # Шаг 4 (Оплата)
        self.payment_method_select = page.get_by_test_id("payment-method")
        self.finish_button = page.get_by_test_id("finish")
        self.success_message = page.get_by_test_id("payment-success-message")

    def proceed_from_cart(self):
        """Перейти от просмотра корзины к шагу авторизации"""
        self.proceed_1_button.click()

    def confirm_sign_in_step(self):
        """Подтвердить шаг профиля (для авторизованного пользователя)"""
        self.proceed_2_button.click()

    def complete_address_step(self, postal_code: str = "1010", house_number: str = "1", state: str = "Vienna"):
        """Заполнить адрес доставки и перейти к оплате"""
        self.postal_code_input.fill(postal_code)
        self.house_number_input.fill(house_number)
        self.state_input.fill(state)
        self.proceed_3_button.click()

    def pay_and_finish(self, method: str = "cash-on-delivery"):
        """Выбрать способ оплаты и подтвердить заказ"""
        self.payment_method_select.select_option(method)
        self.finish_button.click()
