# Chatbot Backend Test Script
# This script tests the chatbot service independently

from modules.chatbot.chatbot_service import ChatbotService

# Test queries
test_queries = [
    "How many tasks do I have?",
    "Show me my tasks",
    "help",
    "Show pending tasks",
    "What is my account info?"
]

print("Testing Chatbot Service...")
print("=" * 50)

# Note: This requires a valid account_id from your database
# Replace with an actual account ID for testing
test_account_id = "your_account_id_here"

for query in test_queries:
    print(f"\n📝 Query: {query}")
    try:
        result = ChatbotService.process_query(query, test_account_id)
        print(f"✅ Success: {result['success']}")
        print(f"📢 Response: {result['response'][:100]}...")
        print(f"🏷️  Type: {result.get('type', 'N/A')}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    print("-" * 50)

print("\nTest completed!")
