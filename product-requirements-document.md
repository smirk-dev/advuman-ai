Product Requirements Document: Advuman
======================================

**Version:** 1.0**Status:** Draft**Date:** 2026-01-08

1\. Goals and Background Context
--------------------------------

**Goals:**

*   Create a "single fabric" of truth by unifying Email, File, and Workflow data.
    
*   Deliver a "Retrieval First" chat interface that prioritizes source citation to build trust.
    
*   Empower Middle Leaders to retrieve context instantly without "hunting."
    

**Background:**Leaders are losing time to information fragmentation. Advuman is the digital agent that restores control by listening, connecting, and delivering truth. The MVP focuses on the core value proposition: **Unified Ingestion** and **Contextual Retrieval** with strict privacy controls.

2\. Requirements
----------------

### Functional Requirements (FR)

*   **FR1 - Data Ingestion Engine:** System must ingest text data from Google Workspace (Gmail, Drive) and/or Microsoft 365 (Outlook, OneDrive) via OAuth.
    
*   **FR2 - Unified Indexing:** Ingested data must be chunked, anonymized (per risk mitigation), and indexed into a vector database for semantic retrieval.
    
*   **FR3 - Contextual Chat Interface:** Users must interact via a chat UI that accepts natural language queries (e.g., "What was the decision on the Q3 budget?").
    
*   **FR4 - Source Citation:** Every AI response must include clickable citations linking directly to the source email or document.
    
*   **FR5 - Role-Based Access Control (RBAC):** Users see only the data they have permission to access in the source system.
    
*   **FR6 - History Threading:** The agent must maintain conversation history to allow follow-up questions ("Who sent that?").
    

### Non-Functional Requirements (NFR)

*   **NFR1 - Privacy:** No customer data used for model training. Data is processed transiently or stored in a dedicated, isolated tenant.
    
*   **NFR2 - Latency:** Retrieval and response generation should occur within <5 seconds for standard queries.
    
*   **NFR3 - Clarity:** AI must refuse to answer if no source data is found (Anti-Hallucination protocol).
    

3\. User Interface Design Goals
-------------------------------

*   **Vibe:** "Intelligent without being intimidating." Minimalist, clean, focused on the text.
    
*   **Core View:** A central chat stream.
    
*   **Sidebar:** "Fabric View" showing recently active threads/files (visualizing the connected data).
    
*   **Platform:** Web Responsive (Desktop focus for Managers).
    

4\. Technical Assumptions (Input for Architect)
-----------------------------------------------

*   **LLM:** Large Context Model (e.g., Gemini 1.5 Pro or GPT-4o) for handling retrieval synthesis.
    
*   **Vector DB:** Pinecone or Weaviate for handling the "Data Volume" chunking/indexing.
    
*   **Auth:** NextAuth/Auth0 handling Enterprise SSO.
    

5\. Epic List (MVP)
-------------------

1.  **Epic 1: The Fabric Foundation (Ingestion & Auth)**
    
    *   Goal: Securely connect to a user's data source (e.g., G-Suite) and index their documents.
        
2.  **Epic 2: The Agent Brain (Retrieval & Synthesis)**
    
    *   Goal: Implement the RAG (Retrieval Augmented Generation) pipeline that finds the right chunks and generates an answer with citations.
        
3.  **Epic 3: The Interface (Chat UI)**
    
    *   Goal: Build the user-facing chat application where leaders ask questions and see results.
        
4.  **Epic 4: Trust & Control (RBAC & Anonymization)**
    
    *   Goal: Implement strict permission filters and data anonymization rules before indexing.