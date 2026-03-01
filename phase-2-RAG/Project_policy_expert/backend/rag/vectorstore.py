
# rag/vectorstore.py
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from decouple import config
from langchain_google_genai import GoogleGenerativeAIEmbeddings

_embeddings = None
_vectorstore = None


def get_vectorstore():
    global _embeddings, _vectorstore

    if _vectorstore is None:
        #  create embeddings and for text to vector conversion
        _embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            api_key=config("GEMINI_API_KEY"),
        )

        # initialize Chroma vector store instance
        _vectorstore = Chroma(
            collection_name=f"docs_collection",
            embedding_function=_embeddings,
            persist_directory="./local_chromaDb/",  # local directory where data stored
        )

    return _vectorstore