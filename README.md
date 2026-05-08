# Faculty Insight Assistant

## Project Overview

Frontend-only React prototype for a faculty analytics assistant. Faculty can ask natural-language questions about Canvas-like activity, review at-risk students or problematic modules, and simulate actions such as nudging a student or flagging a module.

The scaffold follows the PRD target: a static GitHub Pages-ready SPA using React, TypeScript, Vite, Ant Design, ASU theme tokens, hash routing, mock fixtures, and browser localStorage for simulated action state.

## Getting Started

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Run the Prototype

```bash
npm run dev
```

Open the localhost URL printed by Vite.

### 3. Build Static Assets

```bash
npm run build
```

The build output is written to `dist/` and is configured with a relative asset base for GitHub Pages.

### Optional Python Client

The existing CreateAI client is retained as reference material, but it is not part of the frontend-only prototype path.

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Set Up Environment Variables

Copy `env.example.txt` to `.env` and fill in your API credentials:

```bash
cp env.example.txt .env
```

Then edit `.env` and configure:
- `CREATEAI_API_KEY`: Your CreateAI API key
- `CREATEAI_API_ENDPOINT`: API endpoint URL (already set to `https://api-dev-poc.aiml.asu.edu/query`)
- `CREATEAI_PROJECT_ID`: Optional project ID

### Use the CreateAI Client

The project includes a ready-to-use Python client (`createai_client.py`). Here's a quick example:

```python
from createai_client import CreateAIClient

# Initialize client (uses .env file automatically)
client = CreateAIClient()

# Make a query
response = client.query("What is Python?")
print(response.get("response", "Error"))

# Query with project ID
response = client.query_project("Explain Python dictionaries")
print(response.get("response", "Error"))
```

See `createai_client.py` for more examples and full API documentation.

## Architecture

```text
User Browser
  -> React SPA served as static files
    -> HashRouter for GitHub Pages-safe navigation
    -> Ant Design components themed with ASU maroon/gold/gray tokens
    -> Static TypeScript fixtures for course, student, and module data
    -> Rule-based query engine for supported demo intents
    -> localStorage service for simulated nudges, flags, and activity log
```

The prototype has no backend, no database, no real Canvas API, and no real LLM call. Future API contracts from the PRD are represented by frontend service boundaries so the demo can later swap mock logic for real endpoints.

## User Journey

1. Faculty selects a demo course.
2. Faculty enters the dashboard and sees a prominent assistant query box.
3. Faculty asks a supported question or chooses an example prompt.
4. The rule-based query engine maps the prompt to a mock intent.
5. The dashboard shows a summary, counts, actionable rows, and recommended next steps.
6. Next implementation pass adds drawers, confirmation modals, localStorage-backed nudges, module flags, and activity log entries.

## Project Structure

```text
.
├── index.html
├── package.json
├── requirements.txt
├── vite.config.ts
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── assets
│   ├── components
│   ├── data
│   │   └── mockData.ts
│   ├── hooks
│   ├── pages
│   │   ├── CourseSelectionPage.tsx
│   │   └── DashboardPage.tsx
│   ├── routes
│   ├── services
│   │   ├── prototypeStorage.ts
│   │   └── queryEngine.ts
│   ├── styles
│   │   └── global.css
│   ├── types
│   │   └── domain.ts
│   └── utils
└── can-you-conceptualize-a-way-to-build-a-frontend-only-prototy-prd.md
```

## Review Documentation

- **Product Requirements Document**: See `can-you-conceptualize-a-way-to-build-a-frontend-only-prototy-prd.md` for complete project specifications
- **API Documentation**: See `API_DOCUMENTATION.html` for details on using the CreateAI API

## Next Steps

1. Implement student and module detail drawers.
2. Wire nudge and flag confirmation modals to `prototypeStorage`.
3. Render localStorage-backed activity log entries.
4. Add threshold controls and course filters.
5. Run accessibility checks for keyboard focus, labels, and contrast.

## Resources

- [CreateAI API Documentation](./API_DOCUMENTATION.html)
- [Product Requirements Document](./can-you-conceptualize-a-way-to-build-a-frontend-only-prototy-prd.md)
- [Python Client Code](./createai_client.py)
