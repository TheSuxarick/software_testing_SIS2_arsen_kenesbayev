from playwright.sync_api import Page

class ProductPage:
    def __init__(self, page: Page):
        self.page = page
        
        # Главная страница / каталог
        self.product_cards = page.locator(".card")
        self.product_names = page.get_by_test_id("product-name")
        self.product_prices = page.get_by_test_id("product-price")
        
        # Детальная страница товара
        self.detail_name = page.get_by_test_id("product-name")
        self.detail_price = page.get_by_test_id("unit-price")
        self.add_to_cart_button = page.get_by_test_id("add-to-cart")
        self.cart_link = page.get_by_test_id("nav-cart")
        self.cart_quantity_badge = page.get_by_test_id("cart-quantity")

    def navigate_home(self):
        """Открыть главную страницу каталога"""
        self.page.goto("https://practicesoftwaretesting.com")
        self.product_names.first.wait_for(state="visible")

    def open_product_by_index(self, index: int = 0):
        """Открыть карточку товара по индексу"""
        self.product_names.nth(index).click()
        self.add_to_cart_button.wait_for(state="visible")

    def get_product_details(self) -> dict:
        """Получить название и цену открытого товара"""
        return {
            "name": self.detail_name.inner_text().strip(),
            "price": float(self.detail_price.inner_text().replace("$", "").strip())
        }

    def add_to_cart(self):
        """Добавить текущий товар в корзину"""
        self.add_to_cart_button.click()
        # Ждем обновления бейджа корзины
        self.cart_quantity_badge.wait_for(state="visible")

    def go_to_cart(self):
        """Перейти в корзину через верхнее меню"""
        self.cart_link.click()
