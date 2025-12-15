"""Chatbot REST API Server"""
from flask import Blueprint

from modules.chatbot.chatbot_view import ChatbotView


class ChatbotRestApiServer:
    """REST API server for chatbot endpoints"""
    
    @staticmethod
    def create() -> Blueprint:
        """Create and configure chatbot blueprint"""
        blueprint = Blueprint("chatbot", __name__, url_prefix="/chatbot")
        
        # Register chatbot query endpoint
        blueprint.add_url_rule(
            "/query",
            view_func=ChatbotView.as_view("chatbot_query"),
            methods=["POST"]
        )
        
        return blueprint
