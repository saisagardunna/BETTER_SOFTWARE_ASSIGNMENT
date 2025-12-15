import json
from server import app
from tests.modules.task.base_test_task import BaseTestTask
from modules.task.types import TaskErrorCode

class TestCommentApi(BaseTestTask):
    def test_create_comment(self):
        account, token = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        
        url = f"http://127.0.0.1:8080/api/accounts/{account.id}/tasks/{task.id}/comments"
        
        response = self.make_authenticated_request(
            "POST", account.id, token, data={"content": "This is a test comment"},
            task_id=None # We construct URL manually or need to update helper, but helper takes task_id for task endpoints. 
                         # Actually make_authenticated_request constructs url based on task_id arg. 
                         # But here we need specific comment url.
                         # BaseTestTask helpers are tied to Task URLs.
                         # I should better send request manually using client or override url.
        )
        # make_authenticated_request is a bit rigid. I will use helper methods but manually handle URL if needed.
        # But wait, BaseTestTask methods return client.post(url...)
        # I can just use app.test_client() as in CreateComment params.
        
        # Let's just use what I need.
        with app.test_client() as client:
            headers = {**self.HEADERS, "Authorization": f"Bearer {token}"}
            response = client.post(
                url, headers=headers, data=json.dumps({"content": "This is a test comment"})
            )
            
            assert response.status_code == 201
            assert response.json["content"] == "This is a test comment"
            assert response.json["task_id"] == task.id
            assert response.json["account_id"] == account.id
            assert "id" in response.json

    def test_get_comments(self):
        account, token = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        url = f"http://127.0.0.1:8080/api/accounts/{account.id}/tasks/{task.id}/comments"
        
        with app.test_client() as client:
            headers = {**self.HEADERS, "Authorization": f"Bearer {token}"}
            client.post(url, headers=headers, data=json.dumps({"content": "Comment 1"}))
            client.post(url, headers=headers, data=json.dumps({"content": "Comment 2"}))

            response = client.get(url, headers=headers)
            
            assert response.status_code == 200
            assert len(response.json) == 2
            assert response.json[0]["content"] == "Comment 2"
            assert response.json[1]["content"] == "Comment 1"

    def test_update_comment(self):
        account, token = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        url = f"http://127.0.0.1:8080/api/accounts/{account.id}/tasks/{task.id}/comments"
        
        with app.test_client() as client:
            headers = {**self.HEADERS, "Authorization": f"Bearer {token}"}
            create_resp = client.post(url, headers=headers, data=json.dumps({"content": "Original"}))
            comment_id = create_resp.json["id"]

            update_url = f"{url}/{comment_id}"
            response = client.patch(update_url, headers=headers, data=json.dumps({"content": "Updated"}))

            assert response.status_code == 200
            assert response.json["content"] == "Updated"

    def test_delete_comment(self):
        account, token = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        url = f"http://127.0.0.1:8080/api/accounts/{account.id}/tasks/{task.id}/comments"
        
        with app.test_client() as client:
            headers = {**self.HEADERS, "Authorization": f"Bearer {token}"}
            create_resp = client.post(url, headers=headers, data=json.dumps({"content": "Delete Me"}))
            comment_id = create_resp.json["id"]

            delete_url = f"{url}/{comment_id}"
            response = client.delete(delete_url, headers=headers)

            assert response.status_code == 204
            
            # Verify
            get_resp = client.get(url, headers=headers)
            assert len(get_resp.json) == 0

    def test_delete_comment_not_found(self):
        account, token = self.create_account_and_get_token()
        task = self.create_test_task(account_id=account.id)
        fake_id = "507f1f77bcf86cd799439011"
        url = f"http://127.0.0.1:8080/api/accounts/{account.id}/tasks/{task.id}/comments/{fake_id}"
        
        with app.test_client() as client:
            headers = {**self.HEADERS, "Authorization": f"Bearer {token}"}
            response = client.delete(url, headers=headers)
            assert response.status_code == 204
