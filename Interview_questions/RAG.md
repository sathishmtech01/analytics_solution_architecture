    I. RAG (Retrieval-Augmented Generation) Fundamentals
    Q: What is RAG and why is it used?
    A: RAG is a framework that improves LLM responses by fetching relevant data from external knowledge sources (databases, documents) and providing it as context to the LLM. It reduces hallucinations and ensures answers are grounded in up-to-date, domain-specific information.

    Q: What are the main components of a RAG pipeline?
    A:
    Ingestion: Loading, Chunking, Embedding, and Indexing in a Vector DB.
    Retrieval: Querying the Vector DB to find relevant chunks.
    Generation: Passing query + retrieved context to an LLM.

    Q: What is "Naive RAG" vs. "Advanced RAG"?
    A: Naive RAG uses simple fixed-size chunking and vector-only retrieval, often leading to low precision. Advanced RAG uses hybrid search (vector+BM25), chunking strategies (semantic), and re-ranking to improve precision.

    II. Chunking Strategies
    Q: What is chunking, and why is it critical?
    A: Chunking is breaking large documents into smaller, manageable pieces to fit within an LLM's context window and to focus retrieval on specific information. Poor chunking leads to fragmented context or too much noise.

    Q: What are the different types of chunking strategies?
    A:
    Fixed-size: Splitting by character/token count. Simple but can break sentences.
    Recursive: Splitting by a hierarchy of separators (e.g., \n\n, \n, . ). Better at keeping paragraphs together.
    Semantic Chunking: Using embedding models to group text based on meaning, rather than size.
    Agentic/Smart: Using an LLM to decide on logical splits (e.g., separating by topic).

    Q: What are optimal "Chunk Size" and "Overlap"?
    A: A common starting point is 512–1024 tokens, with 10–20% overlap. Overlap is crucial to avoid losing context between two chunks.

    III. Embeddings Model & Vector DB
    Q: What is an embedding model and what is its role?
    A: An embedding model (e.g., BERT, Ada-002) converts text chunks into numerical vectors (dense embeddings) that capture the semantic meaning. These vectors are stored in a Vector DB for similarity searching.

    Q: What is a Vector Database?
    A: A specialized database that stores embeddings and allows for efficient, fast similarity searches (like Cosine Similarity or Approximate Nearest Neighbor) to retrieve relevant content.

    Q: What is "Hybrid Search" in a Vector Database?
    A: Hybrid search combines Vector Search (semantic meaning) with Keyword Search (BM25 - exact matches). This is crucial because embedding models sometimes ignore rare terms like product IDs or specialized jargon.

    IV. BM25 (Keyword Search)
    Q: What is BM25 and why use it in RAG?
    A: BM25 (Best Matching 25) is an updated version of TF-IDF. It is a sparse retrieval method that ranks documents based on the exact appearance of keywords. It is fast, efficient, and great for finding exact identifiers (e.g., "Error-E4392").

    Q: When should I prefer BM25 over dense vector search?
    A: Use BM25 when precision is critical, for technical queries, when searching for codes/identifiers, or when the dataset is small.

    V. Re-ranking (Two-Stage Retrieval)
    Q: What is re-ranking in RAG?
    A: Re-ranking is a second-stage process where an initial set of retrieved chunks (e.g., top 25) is refined to a smaller set (e.g., top 5) using a more accurate, expensive model (Cross-Encoder) to re-order them by relevance.

    Q: What is the difference between a Bi-Encoder and a Cross-Encoder?
    A:
    Bi-Encoder (Embedding Model): Fast, encodes query and document separately. Used for initial retrieval.
    Cross-Encoder (Re-ranker): Slow, encodes query-document pair together, offering much higher precision.

    Q: How does re-ranking improve RAG?
    A: Re-ranking fixes retrieval failures where the correct answer was retrieved but ranked low (e.g., position 8) and would have been cut off before reaching the LLM. It can increase accuracy by 10-30%.

    VI. Performance Debugging & Optimization
    Q: My RAG gives wrong answers. What should I check first?
    A:
    Retrieve? Did the correct chunk get retrieved in the first place? (Check BM25 and Vector search independently).
    Contextual Meaning? Is the chunk too short, lacking necessary context?.
    Identify? Are specific keywords/identifiers needed for the query being dropped by semantic search? (Need hybrid search).

    Q: What is Reciprocal Rank Fusion (RRF)?
    A: RRF is a method to merge results from multiple search engines (like BM25 + Vector) without needing to tune their weights.
