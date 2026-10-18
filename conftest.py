import pytest
from playwright.sync_api import Playwright

@pytest.fixture(scope="session", autouse=True)
def configure_test_id(playwright: Playwright):
    # В Python Playwright selectors настраиваются через объект playwright
    playwright.selectors.set_test_id_attribute("data-test")
