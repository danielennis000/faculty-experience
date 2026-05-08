"""
CreateAI API Client
Generated for project: can-you-conceptualize-a-way-to-build-a-frontend-only-prototy

This client uses environment variables for secure API key management.
Set your API key in a .env file or as an environment variable.

Usage:
    1. Create a .env file in this directory:
       CREATEAI_API_KEY=your_api_key_here
       CREATEAI_API_ENDPOINT=https://api-dev-poc.aiml.asu.edu/query
       # CREATEAI_PROJECT_ID=your_project_id_here (optional)

    2. Install python-dotenv: pip install python-dotenv

    3. Use the client:
       from createai_client import CreateAIClient
       client = CreateAIClient()
       response = client.query("What is Python?")
       print(response.get("response", "Error"))

       # Query with project ID
       # response = client.query_project("What is Python?", project_id="your_project_id")

       # Create raw API key
       # token = client.create_raw_api_key(project_id="your_project_id")

Note: The default endpoint is set to https://api-dev-poc.aiml.asu.edu/query.
      No project ID is set by default.
      You can override these by setting CREATEAI_API_ENDPOINT and CREATEAI_PROJECT_ID in your .env file.
"""
import os
import requests
from typing import Optional, Dict, Any

# Try to load from .env file if python-dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv not installed, use environment variables directly


class CreateAIClient:
    """
    Client for interacting with the CreateAI API

    Uses environment variables for secure API key management.
    Set CREATEAI_API_KEY and CREATEAI_API_ENDPOINT in your environment or .env file.

    Usage:
        client = CreateAIClient()
        response = client.query("What is Python?")
        print(response.get("response", "Error"))
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        api_endpoint: Optional[str] = None,
        project_id: Optional[str] = None
    ):
        """
        Initialize the client

        Args:
            api_key: Your API key (optional, will use CREATEAI_API_KEY env var if not provided)
            api_endpoint: API endpoint URL (optional, will use CREATEAI_API_ENDPOINT env var if not provided)
            project_id: Optional project ID (can also be set via CREATEAI_PROJECT_ID env var)
        """
        self.api_key = api_key or os.environ.get("CREATEAI_API_KEY")
        # Default endpoint: use provided endpoint, then env var, then fallback to the selected endpoint
        # This allows users to override in .env while having a sensible default
        self.api_endpoint = api_endpoint or os.environ.get("CREATEAI_API_ENDPOINT") or "https://api-dev-poc.aiml.asu.edu/query"
        self.project_id = project_id or os.environ.get("CREATEAI_PROJECT_ID")

        if not self.api_key:
            raise ValueError(
                "API key is required. Set CREATEAI_API_KEY environment variable or pass api_key parameter.\n"
                "Create a .env file with: CREATEAI_API_KEY=your_api_key_here"
            )

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def query(
        self,
        prompt: str,
        model_provider: str = "openai",
        model_name: str = "gpt4o",
        max_tokens: int = 400,
        temperature: float = 0.2,
        system_prompt: Optional[str] = None,
        session_id: Optional[str] = None,
        enable_history: bool = False,
        enable_search: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Query the CreateAI API

        Args:
            prompt: The user's query/prompt
            model_provider: Provider name (e.g., "openai", "aws", "gcp-deepmind")
            model_name: Model name (e.g., "gpt4o", "claude3_sonnet")
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature (0.0-1.0)
            system_prompt: Optional system prompt
            session_id: Session ID for conversation history
            enable_history: Enable conversation history
            enable_search: Enable document search
            **kwargs: Additional model parameters

        Returns:
            Dictionary with response data
        """
        model_params = {
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        if system_prompt:
            model_params["system_prompt"] = system_prompt

        if enable_history:
            model_params["enable_history"] = enable_history

        if enable_search:
            model_params["enable_search"] = enable_search

        for key, value in kwargs.items():
            if value is not None:
                model_params[key] = value

        payload = {
            "action": "query",
            "query": prompt,
            "model_provider": model_provider,
            "model_name": model_name,
            "model_params": model_params
        }

        if session_id:
            payload["session_id"] = session_id

        try:
            response = requests.post(
                self.api_endpoint,
                headers=self.headers,
                json=payload,
                timeout=60
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                "error": str(e),
                "status_code": getattr(e.response, "status_code", None) if hasattr(e, "response") else None
            }

    def query_project(
        self,
        prompt: str,
        project_id: Optional[str] = None,
        model_provider: str = "openai",
        model_name: str = "gpt4o",
        max_tokens: int = 400,
        temperature: float = 0.2,
        system_prompt: Optional[str] = None,
        session_id: Optional[str] = None,
        enable_history: bool = False,
        enable_search: bool = False,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Query the CreateAI API with a project ID

        This method queries using project-specific settings. If project_id is not provided,
        it will use the project_id from initialization or environment variables.

        Args:
            prompt: The user's query/prompt
            project_id: Project ID (optional, uses self.project_id if not provided)
            model_provider: Provider name (e.g., "openai", "aws", "gcp-deepmind")
            model_name: Model name (e.g., "gpt4o", "claude3_sonnet")
            max_tokens: Maximum tokens in response
            temperature: Sampling temperature (0.0-1.0)
            system_prompt: Optional system prompt
            session_id: Session ID for conversation history
            enable_history: Enable conversation history
            enable_search: Enable document search
            **kwargs: Additional model parameters

        Returns:
            Dictionary with response data
        """
        use_project_id = project_id or self.project_id

        model_params = {
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        if system_prompt:
            model_params["system_prompt"] = system_prompt

        if enable_history:
            model_params["enable_history"] = enable_history

        if enable_search:
            model_params["enable_search"] = enable_search

        for key, value in kwargs.items():
            if value is not None:
                model_params[key] = value

        payload = {
            "action": "query",
            "query": prompt,
            "model_provider": model_provider,
            "model_name": model_name,
            "model_params": model_params
        }

        if use_project_id:
            payload["project_id"] = use_project_id

        if session_id:
            payload["session_id"] = session_id

        try:
            response = requests.post(
                self.api_endpoint,
                headers=self.headers,
                json=payload,
                timeout=60
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                "error": str(e),
                "status_code": getattr(e.response, "status_code", None) if hasattr(e, "response") else None
            }

    def create_raw_api_key(
        self,
        project_id: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Create a raw API key (token) for a project

        This method creates a new API key/token. If project_id is not provided,
        it will use the project_id from initialization or environment variables.

        Args:
            project_id: Project ID (optional, uses self.project_id if not provided)
            **kwargs: Additional parameters for token creation

        Returns:
            Dictionary with token/API key data
        """
        use_project_id = project_id or self.project_id

        # Build the project endpoint URL (replace /query with /project)
        project_endpoint = self.api_endpoint.replace("/query", "/project")

        payload = {
            "resource": "token",
            "method": "create",
            "details": {}
        }

        if use_project_id:
            payload["details"]["project_id"] = use_project_id

        for key, value in kwargs.items():
            if value is not None:
                payload["details"][key] = value

        try:
            response = requests.post(
                project_endpoint,
                headers=self.headers,
                json=payload,
                timeout=60
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                "error": str(e),
                "status_code": getattr(e.response, "status_code", None) if hasattr(e, "response") else None
            }


# Example usage
if __name__ == "__main__":
    # Initialize client using environment variables
    # Make sure you have set CREATEAI_API_KEY in your .env file or environment
    # Example .env file:
    # CREATEAI_API_KEY=your_api_key_here
    # CREATEAI_API_ENDPOINT=https://api-dev-poc.aiml.asu.edu/query

    # The client will use https://api-dev-poc.aiml.asu.edu/query by default if CREATEAI_API_ENDPOINT is not set

    try:
        # Example 1: Basic query without project ID
        client = CreateAIClient()
        result = client.query("Hello, this is a test query.")
        print("Basic query result:", result.get("response", result))

        # Example 2: Query with project ID (using instance project_id)
        # client_with_project = CreateAIClient(project_id="your_project_id")
        # result2 = client_with_project.query_project("Hello, project query.")
        # print("Project query result:", result2.get("response", result2))

        # Example 3: Query project with explicit project_id parameter
        # result3 = client.query_project("Hello, explicit project query.", project_id="your_project_id")
        # print("Explicit project query result:", result3.get("response", result3))

        # Example 4: Create raw API key without project ID
        result4 = client.create_raw_api_key()
        print("Raw API key (no project):", result4)

        # Example 5: Create raw API key with project ID
        # result5 = client.create_raw_api_key(project_id="your_project_id")
        # print("Raw API key (with project):", result5)

    except ValueError as e:
        print(f"Configuration Error: {e}")
        print("\nTo fix this:")
        print("1. Create a .env file in this directory")
        print("2. Add: CREATEAI_API_KEY=your_api_key_here")
        print("3. Optionally add: CREATEAI_PROJECT_ID=your_project_id_here")
        print("4. Install python-dotenv: pip install python-dotenv")
