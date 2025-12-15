from modules.account.account_service import AccountService
from modules.config.config_service import ConfigService
from scripts.bootstrap_app import BootstrapApp
from flask import Flask
from modules.application.application_service import ApplicationService

app = Flask(__name__)
# Initialize config/services if needed (usually handled by imports/service mounting)

try:
    account = AccountService.get_account_by_username(username="test@example.com")
    print(f"User found: {account.id}, {account.username}")
except Exception as e:
    print(f"User not found or error: {e}")
