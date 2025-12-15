import pytest
import mongomock
from unittest.mock import MagicMock, patch

@pytest.fixture(scope="session", autouse=True)
def mock_mongo():
    with patch("modules.application.repository.ApplicationRepositoryClient.get_client") as mock_get_client:
        mock_client = mongomock.MongoClient("mongodb://localhost:27017/test_db")
        
        def mock_command(self, command, **kwargs):
            return {"ok": 1.0}
            
        with patch("mongomock.database.Database.command", mock_command):
             mock_get_client.return_value = mock_client
             yield mock_client
