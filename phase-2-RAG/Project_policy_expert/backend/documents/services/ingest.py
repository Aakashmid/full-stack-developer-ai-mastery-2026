from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
# from langchain_huggingface import HuggingFaceEmbeddings
from decouple import config
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter


def ingest_document(document):
    """
    PDF → chunks → embeddings → Chroma
    """

    # 1. loading file 
    file_path =  document.file.path
    loader = PyPDFLoader(file_path)

    docs = loader.load()


    # 2. splitting into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, chunk_overlap=200, add_start_index=True
    )
    chunks = text_splitter.split_documents(docs)

    # update metadata for each chunk
    for chunk in chunks:
        chunk.metadata.update({
            "document_id": document.id,
            "user_id": document.uploaded_by.id,
            "source": document.file.name,
        })


    # 3. create embeddings and ingest into Chroma
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        api_key=config("GEMINI_API_KEY"),
    )

    # chroma instance for the document
    vector_store = Chroma(
        collection_name=f"docs_collection",
        embedding_function=embeddings,
        persist_directory="./local_chromaDb/",  # local directory where data stored
    )

    # filter out empty chunks (these will produce empty embeddings)
    non_empty_chunks = [c for c in chunks if c.page_content and c.page_content.strip()]
    if not non_empty_chunks:
        # logger.warning("No non-empty text chunks found for document id=%s, skipping ingest", document.id)
        return

    # try:
    #     vector_store.add_documents(non_empty_chunks)
    # except ValueError as e:
    #     # This often means the embedding call returned an empty list; log details for debugging
    #     logger.exception("Failed to upsert embeddings for document id=%s: %s", document.id, str(e))
    #     raise
    # except Exception:
    #     logger.exception("Unexpected error while adding documents to vector store for document id=%s", document.id)
    #     raise

    vector_store.add_documents(non_empty_chunks)
    
    document.processed = True
    document.save()


