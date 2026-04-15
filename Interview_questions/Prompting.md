    Fundamental & Strategic Questions
    Q: What is the difference between zero-shot, few-shot, and Chain-of-Thought (CoT) prompting?
    A: Zero-shot prompts the model without examples, relying on its pre-trained knowledge. Few-shot provides a few examples (shots) within the prompt to show the desired pattern or structure. CoT encourages the model to generate intermediate reasoning steps before answering, significantly improving performance on complex logic or math tasks.
    Q: Why is Persona-Based prompting effective?
    A: Assigning a specific persona (e.g., "You are a senior data analyst") sets context, tone, and constraints, guiding the model to adopt a specific, expert-level perspective.
    Q: How can you reduce hallucinations in LLM outputs?
    A: Ground the model by providing relevant context or documents to use (Retrieval-Augmented Generation or RAG), instruct it to say "I don't know" if the answer is not in the text, and use lower temperature settings to reduce creative, inaccurate leaps.

    Technical & Engineering Questions
    Q: What is Prompt Chaining?
    A: Breaking down a massive, complex task into a sequence of smaller, manageable prompts where the output of one prompt becomes the input for the next. This improves accuracy and makes debugging easier.
    Q: How do you handle Prompt Leakage/Security?
    A: Treat prompts as sensitive, sanitize inputs to avoid SQL-style injections, and use delimiter tags (e.g., """) to isolate instructions from user-provided data.
    Q: What is the purpose of System Prompts versus User Prompts?
    A: System prompts define the overall behavior, constraints, and persona (the "rules" of the interaction). User prompts are the specific, immediate tasks or questions requested by the user.

    Evaluation & Optimization Questions
    Q: How do you measure the effectiveness of a prompt?
    A: By using quantitative metrics such as accuracy, latency, and consistency across a set of test cases. Qualitative evaluation (human-in-the-loop) is also used to check for tone and relevance.
    Q: How to handle ambiguous prompts?
    A: Design the prompt to instruct the model to ask clarifying questions before attempting the task if the instructions are unclear.

    Advanced Techniques
    Q: What is prompt drift?
    A: The degradation of prompt performance over time as the model evolves or the data distribution shifts.
    Q: How can you optimize prompts for speed (latency)?
    A: Use shorter prompts, minimize unnecessary intermediate steps, and use prompt caching mechanisms.