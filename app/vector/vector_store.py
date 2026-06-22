from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# load model
model = SentenceTransformer("all-MiniLM-L6-v2")

# sample knowledge base (you can expand later)
documents = [
    "Recursion is a function calling itself.",
    "Stack follows LIFO principle.",
    "Queue follows FIFO principle.",
    "Binary search works on sorted arrays.",
    "Linked list stores elements in nodes."
]

# convert to embeddings
embeddings = model.encode(documents)

# create FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings))

def search(query):
    query_vector = model.encode([query])
    distances, indices = index.search(query_vector, k=1)

    return documents[indices[0][0]]