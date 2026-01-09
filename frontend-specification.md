Front-End Specification: Advuman
================================

Version: 1.0

Status: Draft

Date: 2026-01-08

1\. Design Philosophy
---------------------

*   **Core Principle:** "Intelligence without intimidation."
    
*   **Visual Style:** **"Executive Clean."** High whitespace, crisp typography, and a lack of visual clutter. The UI should feel like a quiet, organized office.
    
*   **Interaction Model:** **"Don't Make Me Hunt."** Information comes to the user. Citations are immediately accessible.
    

2\. Color Palette & Typography
------------------------------

*   **Primary (Trust):** Advuman Navy (#0F172A) - Used for sidebar, branding, and primary buttons.
    
*   **Secondary (Clarity):** Paper White (#FFFFFF) and Soft Gray (#F8FAFC) - Backgrounds.
    
*   **Accent (Action):** Signal Blue (#3B82F6) - Used for links, active states, and "Send" buttons.
    
*   **Semantic Colors:**
    
    *   _Source Citation:_ Subtle Purple (#E0E7FF) - Distinct from regular links to indicate "Evidence."
        
    *   _Warning/Privacy:_ Amber (#F59E0B) - Used for "Confidential Data" badges.
        
*   **Typography:** Inter or system-ui. Optimization for high readability at small sizes (dense data).
    

3\. Layout Structure (Desktop First)
------------------------------------

**A. Sidebar** 250px Navigation, History, and Data Source Status (Green dot = Connected).

**B. Main Chat** Flex (Main) The conversation stream. Where the "Agent" lives.

**C. Inspector** 400px (Collapsible)"The Fabric View." Opens when a citation is clicked to show the source document preview.

4\. Key Component Specifications
--------------------------------

### 4.1 The Input Stage (Zone B - Bottom)

*   **Design:** Floating card at the bottom of the center pane.
    
*   **Features:**
    
    *   Auto-expanding text area.
        
    *   "Attach" icon (Paperclip) for ad-hoc file analysis.
        
    *   **Prompt Starters:** If the chat is empty, show pills: _"Summarize Q3 Emails"_, _"Find the Budget.xls"_ (Reduces intimidation).
        

### 4.2 The Response Bubble (Zone B)

*   **Design:** Minimalist cards. AI text is Black on White. User text is White on Navy.
    
*   **Citation Chips:**
    
    *   _Behavior:_ When the AI claims a fact, it appends a chip \[Email from Dave, Jan 4\].
        
    *   _Interaction:_ Clicking the chip **does not** open a new tab. It slides open **Zone C (Inspector)**. This keeps the user in the flow.
        

### 4.3 The Source Inspector (Zone C - Right Panel)

*   **Goal:** Verify "Truth and Confidence."
    
*   **Content:** Displays a read-only preview of the cited email or document.
    
*   **Header:** Shows metadata (Author, Date, Source System icon e.g., Gmail logo).
    
*   **Highlighting:** If possible, highlight the specific sentence used to generate the answer.
    

### 4.4 Data Source Dashboard (Settings)

*   **Goal:** Transparency. "Access is controlled by role."
    
*   **UI:** A grid of cards (Gmail, Drive, Slack).
    
*   **States:**
    
    *   _Connected:_ Green check + "Last synced 2m ago".
        
    *   _Disconnected:_ Gray + "Connect" button.
        
    *   _Ingesting:_ Spinner + "Processing fabric..."
        

5\. User Flows
--------------

### Flow 1: The "Verification Loop" (Critical for Trust)

1.  User asks: _"Why was the project delayed?"_
    
2.  Advuman answers: _"The project was paused due to a budget freeze mentioned by Sarah \[Email: Budget Update\]."_
    
3.  User clicks \[Email: Budget Update\].
    
4.  **Right Panel opens.** User sees the actual email from Sarah.
    
5.  User validates the truth, closes the panel, and continues leading.
    

6\. Accessibility
-----------------

*   **Keyboard Navigation:** Cmd+K to focus the input bar. Esc to close the Inspector panel.
    
*   **Dark Mode:** Fully supported (Essential for late-night executive work).
    

**UX Note:** The "Source Inspector" (Zone C) is the killer feature here. It directly addresses the "Hallucination" fear by making verification instant.