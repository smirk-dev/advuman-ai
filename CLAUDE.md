# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Advuman** is an AI-driven digital agent that unifies fragmented organizational information (emails, files, workflows) into a queryable fabric. The system uses RAG (Retrieval-Augmented Generation) architecture to allow leaders to ask natural language questions and receive accurate, context-aware answers with source citations.

**Target Users:** Middle managers and directors who need instant access to organizational knowledge without hunting through scattered data sources.

**Core Philosophy:** "Intelligence without intimidation" - Truth, context, and confidence through source attribution, not just search.

## Architecture Overview

### System Components

**Frontend (Next.js 14+)**
- Chat interface with streaming responses via Vercel AI SDK
- Source Inspector panel for citation verification
- State management via Zustand
- Tailwind CSS + Shadcn/UI for "Executive Clean" aesthetic
- Deployed on Vercel

**Backend (Python/FastAPI)**
- RAG orchestration using LlamaIndex (preferred over LangChain for data connectors)
- Async task queue with Celery + Redis for document ingestion
- Strict RBAC middleware with metadata filtering
- Deployed on Render/Railway

**Data Layer**
- Vector DB: Pinecone (serverless) or Weaviate with metadata filtering
- Primary DB: PostgreSQL for users, conversation history, source mappings
- Auth: Clerk or Auth0 for enterprise SSO (Google/Microsoft OAuth)
- LLM: Gemini 1.5 Pro or GPT-4o (requires large context window)

### Critical Security Pattern

Every vector chunk is indexed with RBAC metadata:
```
{
  "text": "...",
  "metadata": {
    "allowed_roles": ["group_id_1"],
    "viewers": ["user_email"],
    "source_type": "gmail",
    "author": "Sarah"
  }
}
```

Queries MUST filter by user permissions: `WHERE viewers CONTAINS 'current_user'`. This is hardcoded into the database query logic, not just a policy.

## Development Guidelines

### Data Ingestion Pipeline (Async)
1. OAuth connection to Google/Microsoft workspace
2. Crawl and extract text from PDF, GDoc, Gmail
3. **Anonymize PII** using Presidio before embedding (SSNs, credit cards)
4. Tag with RBAC metadata from source system permissions
5. Generate embeddings and upsert to vector DB

### Retrieval Flow (Real-time)
1. Parse natural language query
2. Construct permission filter based on authenticated user
3. Vector search with metadata filtering (only accessible chunks)
4. LLM synthesis with mandatory source citations
5. Stream response with citation chips that open Source Inspector

### Anti-Hallucination Protocol
- **Retrieval First**: Never generate without retrieved context
- **Citation Mandatory**: Every factual claim must link to source document
- **Refuse to Answer**: If no source data found, explicitly say "I don't have access to that information"

### UI/UX Requirements

**Three-Zone Layout:**
- Zone A (Sidebar): Navigation, history, data source status indicators
- Zone B (Main): Chat stream with AI/user bubbles and citation chips
- Zone C (Inspector): Collapsible right panel showing source document preview with highlighted excerpts

**Citation Interaction Pattern:**
- Clicking `[Email from Dave, Jan 4]` chip opens Zone C (Inspector), NOT a new tab
- Inspector shows full source with metadata (author, date, system icon)
- Keeps user in conversation flow for verification loop

**Color System:**
- Advuman Navy (#0F172A): Sidebar, branding, primary buttons
- Paper White (#FFFFFF) + Soft Gray (#F8FAFC): Backgrounds
- Signal Blue (#3B82F6): Links, active states, send button
- Subtle Purple (#E0E7FF): Citation chips (distinct from regular links)
- Amber (#F59E0B): Confidential data badges

## API Endpoints (Planned)

```
POST /api/chat                    # Main RAG endpoint with streaming
POST /api/connectors/google       # Trigger Google Workspace sync
POST /api/connectors/microsoft    # Trigger Microsoft 365 sync
GET  /api/documents/{id}          # Fetch raw content for Inspector
GET  /api/history                 # Retrieve past conversations
GET  /api/sources/status          # Data source connection states
```

## Key Performance Requirements

- **Latency:** <5 seconds for standard queries (retrieval + generation)
- **Privacy:** No customer data used for training; transient processing only
- **Query Resolution:** Prioritize accuracy over speed ("Clarity matters more")
- **Source Attribution:** 100% of factual claims must have citations

## Documentation Reference

Detailed specifications are in `/docs/`:
- `project-brief.md`: Problem statement, user personas, success metrics
- `architecture.md`: Tech stack, data flows, infrastructure decisions
- `frontend-specification.md`: UI components, color palette, user flows
- `product-requirements-document.md`: Functional/non-functional requirements, MVP epics

## Development Status

Currently a documentation-only repository. When implementation begins:
- Frontend should be initialized with Next.js 14+ App Router
- Backend should use Python 3.11+ with FastAPI and LlamaIndex
- Use Docker for local development consistency
- Prioritize MVP Epic 1 (Fabric Foundation) before building chat UI
