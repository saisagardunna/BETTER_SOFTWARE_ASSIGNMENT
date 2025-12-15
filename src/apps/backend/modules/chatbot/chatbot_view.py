"""REST API views for chatbot"""
from flask import jsonify, request
from flask.typing import ResponseReturnValue
from flask.views import MethodView

from modules.authentication.rest_api.access_auth_middleware import access_auth_middleware
from modules.chatbot.chatbot_service import ChatbotService


class ChatbotView(MethodView):
    """Chatbot API endpoint"""
    
    @access_auth_middleware
    def post(self) -> ResponseReturnValue:
        """
        Process chatbot query
        
        Request body:
        {
            "query": "user's question"
        }
        """
        # Get account_id from request (set by middleware)
        account_id = getattr(request, 'account_id', None)
        
        request_data = request.get_json()
        
        if not request_data or not request_data.get("query"):
            return jsonify({
                "success": False,
                "response": "Please provide a query in your request.",
                "data": {}
            }), 400
        
        query = request_data.get("query", "").strip()
        
        if not query:
            return jsonify({
                "success": False,
                "response": "Query cannot be empty.",
                "data": {}
            }), 400
        
        # Process the query
        result = ChatbotService.process_query(query=query, account_id=account_id)
        
        return jsonify(result), 200
