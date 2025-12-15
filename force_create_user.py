from modules.account.account_service import AccountService
from modules.account.types import CreateAccountByUsernameAndPasswordParams
from modules.config.config_service import ConfigService
from flask import Flask

app = Flask(__name__)

try:
    params = CreateAccountByUsernameAndPasswordParams(
        username="test@example.com", 
        password="testpassword", 
        first_name="Test", 
        last_name="User"
    )
    account = AccountService.create_account_by_username_and_password(params=params)
    print(f"User created: {account.id}, {account.username}")
except Exception as e:
    with open("user_creation_error.txt", "w") as f:
        f.write(str(e))
    print(f"Error checking/creating user: {e}")
