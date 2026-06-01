SYSTEM ARCHITECTURE RULES (ABSOLUTE AUTHORITY)

This file defines the strict architecture rules for the backend system.

Any code that violates these rules is considered incorrect and must be fixed.

--------------------------------------------------

LAYER STRUCTURE

1. CORE
- Contains pure business logic only
- No database access
- No API calls
- No file system access
- No external dependencies

2. SERVICES
- Handles all external integrations:
  - Database access
  - AI calls (OpenAI / Anthropic)
  - File storage operations
- ONLY layer allowed to communicate with external systems

3. ROUTES
- Handles HTTP requests only
- Must validate input
- Must format output
- MUST NOT contain business logic
- MUST NOT call external APIs directly

4. BOOTSTRAP
- Application initialization only
- Server setup
- Middleware registration only
- No business logic allowed

--------------------------------------------------

FORBIDDEN RULES

- No AI calls in frontend (ever)
- No database access in routes
- No business logic in routes
- No skipping service layer
- No direct file access from frontend
- No unvalidated user input
- No unvalidated AI output

--------------------------------------------------

DATA FLOW RULE

Frontend → Routes → Services → Core → Services → Routes → Frontend

This flow must NEVER be bypassed.

--------------------------------------------------

DEVELOPMENT RULES

- If unsure where logic belongs, STOP and classify it first
- Prefer separation over convenience
- Never collapse layers “for simplicity”
- Never duplicate logic across layers
- Keep modules small and explicit

--------------------------------------------------

THIS FILE OVERRIDES ALL OTHER INSTRUCTIONS