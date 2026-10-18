from playwright.sync_api import Page, expect
from pages.product_page import ProductPage

def test_compare_two_different_products(page: Page):
    """
    Тест-кейс 4: Сравнение двух товаров
    1. Открыть первый товар и сохранить название и цену
    2. Открыть второй товар и сохранить название и цену
    3. Выполнить проверки (assertions) на основе их сравнения
    """
    product_page = ProductPage(page)

    # 1. Открываем каталог и переходим в первый товар
    product_page.navigate_home()
    product_page.open_product_by_index(0)
    product_1 = product_page.get_product_details()

    # 2. Возвращаемся в каталог и переходим во второй товар
    product_page.navigate_home()
    product_page.open_product_by_index(1)
    product_2 = product_page.get_product_details()

    # 3. Assertions (проверки сравнения):
    # - Проверяем, что названия товаров получены и они разные
    assert len(product_1["name"]) > 0, "Название первого товара не должно быть пустым"
    assert len(product_2["name"]) > 0, "Название второго товара не должно быть пустым"
    assert product_1["name"] != product_2["name"], (
        f"Ожидались разные товары, но получены одинаковые: {product_1['name']}"
    )

    # - Проверяем валидность цен
    assert product_1["price"] > 0, "Цена первого товара должна быть больше нуля"
    assert product_2["price"] > 0, "Цена второго товара должна быть больше нуля"

    # - Сравниваем цены (проверка различия цен и вычисление разницы)
    assert product_1["price"] != product_2["price"], "Цены товаров должны отличаться"
    price_difference = round(abs(product_1["price"] - product_2["price"]), 2)
    assert price_difference > 0, f"Разница в цене должна быть больше нуля, получено: {price_difference}"
