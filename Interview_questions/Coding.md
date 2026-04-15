    Scenario 1: The "Manual ReAct Loop" (Logic & Reasoning)
    Goal: See if they can implement a basic "Thought-Action-Observation" loop without a framework.
    The Prompt: "Write a Python function run_agent(user_query) that simulates a ReAct loop. You have a mock tool get_weather(city). The agent must:
    Generate a 'Thought' (why it needs the tool).
    Format a specific 'Action' string.
    Accept a hardcoded string response from the tool.
    Provide a final 'Answer' based on that response."
    What to look for: Do they use a while loop? Do they have a clear "stopping condition" for when the final answer is reached? How do they parse the model's "action" request from raw text?
