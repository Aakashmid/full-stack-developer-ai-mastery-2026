
from rag.vectorstore import get_vectorstore
from langchain_google_genai import ChatGoogleGenerativeAI

vector_store = get_vectorstore()

def get_llm():
    print("Initializing LLM...")
    return  ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite" ,temperature=0.2)


SYSTEM_PROMPT = """You are a helpful assistant for answering questions based on the provided context. Use the context to answer the question as accurately as possible. If the context does not contain enough information to answer the question, say  give reason of not getting result (like "The requested information is not available in the provided documents.") . Always provide a concise answer based on the context. Don't hallucinate information that is not present in the context. If the question is unrelated to the context, politely inform the user that you can only answer questions related to the provided information."""

def llm_generate_response(query: str, doc_ids:list):
    """Retrieve information to help answer a query."""

    # vectors search 
    retrieved_docs = vector_store.similarity_search(query,k=3,filter={"document_id": {"$in":doc_ids}})

    context = "\n\n".join(doc.page_content for doc in retrieved_docs)

    # get llm 
    llm = get_llm()


    # call llm with system prompt and user query + context
    response = llm.invoke(
        [
            ("system", SYSTEM_PROMPT),
            ("human", f"Context:\n{context}\n\n Question: {query}"),
        ]
    )

    return {
        "answer": response.content,
        "sources": [
            {
                "source": d.metadata.get("source"),
                "page": d.metadata.get("page"),
                "document_id": d.metadata.get("document_id"),
            }
            for d in retrieved_docs
        ],
    }



    
