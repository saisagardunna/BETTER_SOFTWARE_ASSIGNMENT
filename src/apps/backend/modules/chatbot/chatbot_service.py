"""Enhanced Chatbot service with Groq AI integration"""
from typing import Dict, Any, Optional
import os
from datetime import datetime
from bson.objectid import ObjectId

from modules.task.internal.store.task_repository import TaskRepository
from modules.account.internal.store.account_repository import AccountRepository
from modules.task.internal.task_util import TaskUtil


# Try to import Groq, fall back to basic mode if not available
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    Groq = None


class ChatbotService:
    """AI-powered chatbot service with MongoDB data integration"""

    @staticmethod
    def process_query(query: str, account_id: str) -> Dict[str, Any]:
        """
        Process user query using Groq AI with MongoDB context
        
        Args:
            query: User's question/query
            account_id: ID of the account making the query
            
        Returns:
            Dictionary with response and metadata
        """
        try:
            # Get MongoDB context data
            context_data = ChatbotService._get_account_context(account_id)
            
            # Use Groq AI if available, otherwise fall back to basic responses
            if GROQ_AVAILABLE and os.getenv('GROQ_API_KEY'):
                return ChatbotService._process_with_groq(query, account_id, context_data)
            else:
                return ChatbotService._process_basic(query, account_id, context_data)
                
        except Exception as e:
            return {
                "success": False,
                "response": f"Error processing query: {str(e)}",
                "data": {},
                "type": "error"
            }

    @staticmethod
    def _get_account_context(account_id: str) -> Dict[str, Any]:
        """Gather MongoDB data as context for the AI"""
        context = {
            "account_id": account_id,
            "tasks": [],
            "task_count": 0,
            "status_summary": {},
            "account_info": {}
        }
        
        try:
            # Get task count and status summary
            pipeline = [
                {"$match": {"account_id": account_id, "active": True}},
                {"$group": {"_id": "$status", "count": {"$sum": 1}}}
            ]
            status_results = list(TaskRepository.collection().aggregate(pipeline))
            context["status_summary"] = {item["_id"]: item["count"] for item in status_results}
            context["task_count"] = sum(context["status_summary"].values())
            
            # Get recent tasks
            tasks_bson = list(TaskRepository.collection().find({
                "account_id": account_id,
                "active": True
            }).sort("created_at", -1).limit(10))
            
            tasks = [TaskUtil.convert_task_bson_to_task(task_bson) for task_bson in tasks_bson]
            context["tasks"] = [
                {
                    "title": task.title,
                    "description": task.description,
                    "status": task.status
                }
                for task in tasks
            ]
            
            # Get account info
            account_bson = AccountRepository.collection().find_one({"_id": ObjectId(account_id)})
            if account_bson:
                context["account_info"] = {
                    "email": account_bson.get('email', 'N/A')
                }
                
        except Exception as e:
            print(f"Error getting context: {str(e)}")
            
        return context

    @staticmethod
    def _process_with_groq(query: str, account_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process query using Groq AI"""
        try:
            client = Groq(api_key=os.getenv('GROQ_API_KEY'))
            
            # Build context-aware system message
            system_message = f"""You are an intelligent task management assistant. You have access to the user's data from MongoDB.

User Context:
- Total Tasks: {context['task_count']}
- Task Status Summary: {context['status_summary']}
- Account Email: {context.get('account_info', {}).get('email', 'N/A')}

Recent Tasks (up to 10):
"""
            for idx, task in enumerate(context['tasks'][:10], 1):
                system_message += f"\n{idx}. {task['title']} - Status: {task['status']}"
                if task.get('description'):
                    system_message += f" ({task['description'][:50]}...)"
            
            system_message += """

Instructions:
- Answer the user's questions about their tasks and account
- Be helpful, friendly, and concise
- Use the provided context data to give accurate answers
- If asked about tasks, reference the actual task data above
- Format responses with markdown (use ** for bold)
- Keep responses under 200 words unless more detail is needed
"""
            
            # Call Groq API
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": query}
                ],
                model="llama-3.3-70b-versatile",  # Fast and capable model
                temperature=0.7,
                max_tokens=500,
            )
            
            response_text = chat_completion.choices[0].message.content
            
            return {
                "success": True,
                "response": response_text,
                "data": {
                    "context_used": True,
                    "task_count": context['task_count'],
                    "model": "llama-3.3-70b-versatile"
                },
                "type": "ai_response"
            }
            
        except Exception as e:
            print(f"Groq API error: {str(e)}")
            # Fall back to basic responses on error
            return ChatbotService._process_basic(query, account_id, context)

    @staticmethod
    def _process_basic(query: str, account_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Basic fallback responses when Groq is not available"""
        query_lower = query.lower()
        
        # Task count
        if any(word in query_lower for word in ["how many", "count", "total"]):
            return {
                "success": True,
                "response": f"You have **{context['task_count']}** tasks in total.\n\nStatus breakdown: " + 
                            ", ".join([f"**{status}**: {count}" for status, count in context['status_summary'].items()]),
                "data": context,
                "type": "task_count"
            }
        
        # Task list
        if any(word in query_lower for word in ["show", "list", "tasks"]):
            if not context['tasks']:
                return {
                    "success": True,
                    "response": "You don't have any tasks yet. Would you like to create one?",
                    "data": context,
                    "type": "task_list"
                }
            
            response = f"Here are your recent tasks:\n\n"
            for idx, task in enumerate(context['tasks'][:5], 1):
                response += f"{idx}. **{task['title']}** - {task['status']}\n"
            
            return {
                "success": True,
                "response": response,
                "data": context,
                "type": "task_list"
            }
        
        # Help
        if "help" in query_lower:
            return {
                "success": True,
                "response": """**I can help you with:**

📊 **Task Management:**
- "How many tasks do I have?"
- "Show me my tasks"
- "What's my task status?"

💬 **General Questions:**
- Ask me anything about your tasks
- I use AI to understand your questions!

💡 **Tip:** Just ask in natural language and I'll do my best to help! 🚀""",
                "data": {},
                "type": "help"
            }
        
        # Default response
        return {
            "success": True,
            "response": "I'm here to help! You can ask me about your tasks, account info, or type 'help' to see what I can do. (AI-powered responses are available when Groq API is configured)",
            "data": context,
            "type": "default"
        }
