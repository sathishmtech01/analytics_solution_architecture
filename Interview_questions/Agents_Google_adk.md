    I. Core ADK & Architecture
    Q1: What is the primary problem Google ADK solves compared to standard LLM API calls?
    A: ADK moves development from simple "text-in, text-out" interactions to stateful, multi-turn agentic workflows. Unlike raw API calls, ADK provides a structured framework for:
    State Management: Automatically tracking conversation history and user specific data across turns (Session and User state).
    Orchestration: distinct patterns (Sequential, Parallel) to coordinate multiple agents.
    Tool Integration: A unified interface to connect LLMs with local Python functions or remote services via MCP.
    
    II. Orchestration: Sequence, Parallel, & Selector
    Q2: How does ADK distinguish between a "Model" and an "Agent"?
    A:
    Model: The raw inference engine (e.g., Gemini 1.5 Pro, Llama 3) that predicts the next token.
    Agent: A structured application layer wrapping the model. It includes Prompt templates (persona), Tools (capabilities), Memory (context), and Business Logic (when to stop, how to handle errors).
    Q3: Explain the specific use case for a SequentialAgent in ADK.
    A: Use SequentialAgent when step B strictly depends on the output of step A.
    Example: A "Customer Support Agent" that must first (1) Retrieve Order Status (via API) before it can (2) Draft a Refund Email. The output of step 1 is injected into the context of step 2.
    Q4: How does a ParallelAgent handle race conditions or shared state?
    A: ParallelAgent executes multiple sub-agents concurrently (e.g., distinct threads/coroutines).
    State Handling: They typically read from a shared InvocationContext but should write to distinct output keys to avoid overwriting each other's work.
    Example: A "Trip Planner" launches a FlightSearchAgent and a HotelSearchAgent simultaneously. The parent agent waits for gather() to collect both results before proceeding.
    Q5: What is a "Selector" or "Router" in ADK, and how does it work?
    A: This is often implemented via an LlmAgent with AgentTools.
    Mechanism: The parent agent is given a list of other agents as "tools" (e.g., [MathAgent, WritingAgent]).
    Decision: Based on the user's query (e.g., "Calculate the profit"), the LLM reasons and selects the correct "tool" (delegating to MathAgent) instead of trying to answer itself.
    Router Delegation: The parent hands off the entire session context to the sub-agent, which executes and returns the final result back to the parent.
    
    III. Context Sharing & A2A Protocol
    Q6: What is the difference between Session State and Long-term Memory in ADK?
    A:
    Session State: Ephemeral data relevant only to the current active conversation (e.g., current_order_id, user_sentiment). It is cleared when the session ends.
    Long-term Memory: Persistent data stored in a database (e.g., Vector DB, SQL). It recalls facts across different sessions (e.g., "User prefers aisle seats" learned 2 weeks ago).
    Q7: How does the A2A (Agent-to-Agent) protocol enable interoperability?
    A: A2A is an open standard (JSON-RPC over HTTP) that allows agents to "introduce" themselves.
    Agent Cards: Agents publish a JSON "Card" describing their capabilities, input/output schema, and description.
    Discovery: A client agent can read these cards to dynamically discover and call a remote agent (even one built on a different framework like LangChain) as if it were a local function.
    Q8: How is context passed between a Parent Agent and a Child Agent?
    A: Through the InvocationContext.
    Input: The parent passes a focused input string or a structured dictionary to the child.
    Shared State: Agents in the same workflow often share a mutable State object. A child agent can read state["user_id"] set by the parent without needing it explicitly passed as a function argument.
    IV. Tools & MCP (Model Context Protocol)
    Q9: What is the role of an MCP Router or MCP Server in ADK?
    A:
    MCP Server: A standardized backend that exposes data (like a database row or a file) or tools (API functions) to an AI model.
    MCP Router/Client: The ADK agent acts as the client. It connects to the MCP server, downloads the list of available tools/prompts, and dynamically injects them into the LLM's context window. This decouples the tool definition (server) from the tool usage (agent).
    Q10: How does "Delegation" work when an agent uses a tool?
    A:
    Reasoning: The LLM generates a structured "Tool Call" output (e.g., call: search_database(query="pricing")).
    Interruption: The ADK runtime pauses execution.
    Execution: The runtime executes the Python function or MCP request.
    Resumption: The result is fed back to the LLM as an "Observation," and the agent continues generating the response.
    V. Evaluations
    Q11: How is "Trajectory Evaluation" different from standard "Response Evaluation"?
    A:
    Response Eval: Checks the final answer quality (e.g., "Did it give the right price?").
    Trajectory Eval: audits the process. It checks the intermediate steps (e.g., "Did the agent verify the user's identity before showing account details?"). This is critical for compliance and security.
    Q12: What are "Golden Datasets" in the context of ADK evaluations?
    A: These are curated sets of "perfect" interaction logs used for regression testing. A Golden Dataset typically includes:
    Input: "Book a flight to NY."
    Expected Plan: [Search Flights] -> [Select Flight] -> [Book].
    Expected Output: "Flight AA123 booked."
    Evaluation: The ADK test runner compares the live agent's run against this golden standard to ensure logic hasn't drifted.
    Q13: How does LLM-as-a-Judge work in ADK?
    A: ADK uses a stronger model (e.g., Gemini 1.5 Pro) to grade the output of the agent being tested.
    Rubric: You define a prompt rubric (e.g., "Score coherence from 1-5").
    Process: The Judge LLM reads the agent's conversation trace and assigns a score + explanation, automating qualitative feedback.

     1. "Explain how you would ensure an ADK agent remembers a user's name in a future conversation."
    Answer:
    "I would use Long-Term Memory (LTM) via a MemoryService. While the name might initially be captured in the Session.state (Short-Term Memory) during the active chat, I would trigger a command to store that specific fact in a persistent backend like Vertex AI Memory Bank or a SQL database. This ensures that when a new session starts, the agent can query the memory bank using the user’s ID and pull that preference back into the current context."
     2. "What is the primary difference between Session.state and a MemoryBank in the ADK framework?"
     Answer:
     "The difference lies in persistence and scope. Session.state is the 'Short-Term Memory'; it is ephemeral, stored in RAM (often via InMemorySessionService), and tracks the immediate variables of one conversation. A MemoryBank is the 'Long-Term Memory'; it is persistent and searchable. It uses vector embeddings or structured storage to keep data alive across weeks or months, allowing the agent to 'learn' over time."
      3. "In a complex multi-step task, why is Short-Term Memory (STM) critical for tool-calling?"
      Answer:
      "STM acts as the agent’s working memory. When an agent calls multiple tools (like checking a database then sending an email), it needs to store the output of the first tool to use as the input for the second. In ADK, this context is held in the Session object. Without STM, the agent would lose the 'chain of thought' and wouldn't know what happened in the previous step of the current task."

    
    
