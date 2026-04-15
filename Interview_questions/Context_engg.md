    Key Context Engineering Questions & Answers
    What is the difference between Prompt Engineering and Context Engineering?
    Prompt Engineering asks: "How should I phrase this?" (optimizing the input words).
    Context Engineering asks: "What information does the model need right now?" (optimizing the total data provided to the model, such as retrieved documents and memory).
    
    What are the four main strategies for context engineering?
    Context Compression: Reducing input size by removing irrelevant information to avoid exceeding the context window.
    Writing Context: Using external "scratch pads" (like file-based memory) or agent session state to store data.
    Selecting Context: Using RAG to retrieve only the most relevant information from databases.
    Isolating Context: Breaking large tasks into smaller, manageable tasks handled by separate agents to increase focus.
    
    How do you reduce hallucinations using context engineering?
    Implement RAG for verified retrieval, set strict input constraints, use explicit grounding, and employ validation prompts.
    
    What is context poisoning?
    Context poisoning occurs when false or misleading information enters the prompt, RAG retrieval, or agent memory, causing the model to generate incorrect outputs based on untrusted inputs.
    
    What is context drift?
    It is the tendency of a model to deviate from the original task over a long-running session. It is prevented by regularly reinforcing the system prompt, managing conversation history, and resetting the agent's memory