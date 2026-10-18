import time
from playwright.sync_api import Page, expect
from pages.register_page import RegisterPage

def test_register_new_customer(page: Page):
    register_page = RegisterPage(page)
    
    # Генерируем уникальный email на основе текущего времени
    unique_id = int(time.time())
    user_data = {
        "first_name": "Test",
        "last_name": "User",
        "dob": "1995-05-15",
        "country": "US",
        "postal_code": "90210",
        "house_number": "42",
        "street": "Beverly Hills",
        "city": "Los Angeles",
        "state": "CA",
        "phone": "1234567890",
        "email": f"test_user_{unique_id}@example.com",
        "password": "Xk9#mP2$vL8@qZ5!"
    }

    # 1. Открываем страницу регистрации
    register_page.navigate()

    # 2. Заполняем форму и отправляем
    register_page.register(user_data)

    # 3. Проверка (Assertion):
    # После успешной регистрации сайт перенаправляет на страницу логина (/auth/login)
    expect(page).to_have_url("https://practicesoftwaretesting.com/auth/login", timeout=10000)
