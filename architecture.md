Technical Architecture: Advuman
===============================

**Version:** 1.0**Status:** Draft**Date:** 2026-01-08

1\. High-Level System Design
----------------------------

We will use a **RAG (Retrieval-Augmented Generation)** architecture with a strict "Metadata Filtering" layer for security.

Code snippet

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   graph TD      subgraph "Frontend (Next.js)"          UI[Chat UI & Fabric Inspector]          Auth[Auth Provider (Clerk)]      end      subgraph "Backend API (Python/FastAPI)"          API[API Gateway]          Orch[Orchestration Engine (LangChain)]          Sec[Security & RBAC Middleware]      end      subgraph "Data Pipeline (Async Workers)"          Ingest[Ingestion Worker (Celery)]          Chunk[Chunking & Anonymizer]          Embed[Embedding Model (OpenAI/Cohere)]      end      subgraph "Storage"          PG[(PostgreSQL - Users/History)]          VDB[(Vector DB - Pinecone/Weaviate)]          Redis[(Redis - Cache/Queue)]      end      UI -->|Query + Auth Token| API      API -->|Validate Token| Sec      Sec -->|Scoped Query| Orch      Orch -->|Semantic Search + Metadata Filter| VDB      Orch -->|Context + Prompt| LLM[LLM Provider]      Ingest -->|Fetch Documents| Chunk      Chunk -->|Vectors| Embed      Embed -->|Upsert with Permissions| VDB   `

2\. Tech Stack Selection
------------------------

### 2.1 Frontend (The "Clarity" Layer)

*   **Framework:** **Next.js 14+ (App Router)**. Chosen for Server-Side Rendering (speed) and robust API handling.
    
*   **UI Library:** **Tailwind CSS** + **Shadcn/UI**. Matches the "Executive Clean" aesthetic defined by UX.
    
*   **State Management:** **Zustand**. Lightweight management for the "Split-Pane" state.
    
*   **Streaming:** **Vercel AI SDK**. Essential for the "typing effect" and low-latency feel.
    

### 2.2 Backend (The "Intelligence" Layer)

*   **API Framework:** **FastAPI (Python)**. Python is non-negotiable for RAG/Vector integration. FastAPI provides high-performance async support.
    
*   **Orchestration:** **LlamaIndex**. Preferred over LangChain for this specific use case because LlamaIndex excels at _data connectors_ and _structured retrieval_ (essential for the "Fabric" concept).
    
*   **Task Queue:** **Celery + Redis**. Ingestion of Google Drive/Email is slow; it must happen in the background.
    

### 2.3 Data & Storage (The "Fabric")

*   **Vector Database:** **Pinecone (Serverless)** or **Weaviate**.
    
    *   _Critical Requirement:_ Must support **Metadata Filtering**. Every chunk indexed will have metadata: allowed\_roles: \["group\_id\_1", "user\_id\_A"\].
        
*   **Primary Database:** **PostgreSQL**. Stores User Profiles, Conversation History, and Linkage Maps (e.g., "Which Vector ID maps to which original Email URL").
    
*   **Auth:** **Clerk** or **Auth0**. Handles the complexity of Enterprise SSO (OAuth2 for Google/Microsoft).
    

### 2.4 AI Model

*   **LLM:** **Gemini 1.5 Pro** or **GPT-4o**. We need a _large context window_ model to synthesize answers from multiple retrieved documents without losing nuance.
    

3\. Core Data Flow & Security Strategy
--------------------------------------

### 3.1 The Ingestion Pipeline (Async)

1.  **Connect:** User authorizes Google Drive via OAuth.
    
2.  **Crawl:** System lists files (PDF, GDoc, Gmail).
    
3.  **Process:**
    
    *   Extract text.
        
    *   **Anonymize (PII Redaction):** Use Presidio or similar library to mask SSNs/Credit Cards before embedding (mitigates "Trust" risk).
        
    *   **Tag:** Attach RBAC metadata (e.g., viewers: \[user\_email\]).
        
4.  **Index:** Generate embedding -> Store in Vector DB with metadata.
    

### 3.2 The Retrieval Loop (Real-time)

1.  **User Query:** "What did Sarah say about the budget?"
    
2.  **Filter Construction:** Backend identifies the user. Constructs filter: WHERE author = 'Sarah' AND viewers CONTAINS 'current\_user'.
    
3.  **Vector Search:** Queries the DB _only_ for chunks the user is allowed to see.
    
4.  **Synthesis:** LLM receives the chunks and generates the answer with citations.
    

4\. API Endpoints (Draft)
-------------------------

*   POST /api/chat: Main RAG endpoint.
    
*   POST /api/connectors/google: Trigger an ingestion sync.
    
*   GET /api/documents/{id}: Fetch the raw content for the "Source Inspector" (Zone C).
    
*   GET /api/history: Retrieve past conversations.
    

5\. Infrastructure
------------------

*   **Deployment:** Vercel (Frontend) + Render/Railway (Backend Python).
    
*   **Environment:** Dockerized local development environment for consistency.
    

**Architect Note:** This architecture ensures that "Access is controlled by role" isn't just a policy—it's hard-coded into the database query logic. The separation of Frontend (Next.js) and Backend (FastAPI) allows us to iterate on the UI fast while the heavy data engineering happens in Python.