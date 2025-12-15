import requests
import json

base_url = "http://localhost:8080/api"

# Try to login with existing account
print("Attempting login...")
login_resp = requests.post(f"{base_url}/access-tokens", json={"username": "e2e@test.com", "password": "test123"})

if login_resp.status_code == 201:
    login_data = login_resp.json()
    account_id = login_data['account_id']
    token = login_data['token']
    headers = {"Authorization": f"Bearer {token}"}
    
    print(f"✅ Logged in - Account ID: {account_id[:8]}...")
    
    # Get all tasks
    print("\nFetching tasks from database...")
    tasks_resp = requests.get(f"{base_url}/accounts/{account_id}/tasks", headers=headers)
    
    print(f"Response status: {tasks_resp.status_code}")
    print(f"Response type: {type(tasks_resp.json())}")
    
    if tasks_resp.status_code == 200:
        response_data = tasks_resp.json()
        
        # Handle both list and dict responses
        if isinstance(response_data, list):
            tasks = response_data
        elif isinstance(response_data, dict) and 'data' in response_data:
            tasks = response_data['data']
        else:
            tasks = []
        
        print(f"\n✅ Found {len(tasks)} task(s) in database")
        for i, task in enumerate(tasks, 1):
            print(f"\n  Task {i}:")
            print(f"    ID: {task['id'][:8]}...")
            print(f"    Title: {task['title']}")
            print(f"    Description: {task['description'][:50]}...")
    else:
        print(f"❌ Failed to get tasks: {tasks_resp.status_code}")
        print(tasks_resp.text[:200])
else:
    print(f"❌ Login failed: {login_resp.status_code}")
    print(login_resp.text[:200])
