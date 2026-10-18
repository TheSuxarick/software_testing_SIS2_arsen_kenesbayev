import time
import json
import urllib.request

def create_test_user() -> dict:
    """
    Фабрика тестовых данных: создает уникального пользователя
    через API бэкенда за доли секунды.
    Гарантирует полную независимость тестов друг от друга.
    """
    unique_id = int(time.time() * 1000)
    email = f"user_{unique_id}@testcompany.org"
    password = "Xk9#mP2$vL8@qZ5!"
    
    payload = {
        "first_name": "Test",
        "last_name": "User",
        "dob": "1990-01-01",
        "address": {
            "street": "Beverly Hills",
            "house_number": "42",
            "city": "Los Angeles",
            "state": "CA",
            "country": "US",
            "postal_code": "90210"
        },
        "phone": "1234567890",
        "email": email,
        "password": password
    }

    req = urllib.request.Request(
        "https://api.practicesoftwaretesting.com/users/register",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    urllib.request.urlopen(req)

    return {
        "email": email,
        "password": password,
        "first_name": "Test",
        "last_name": "User"
    }

