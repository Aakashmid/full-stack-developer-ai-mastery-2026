from langchain_community.document_loaders import PyPDFLoader,UnstructuredPDFLoader
from langchain_chroma import Chroma
from rag.vectorstore import get_vectorstore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from decouple import config
import fitz #PyMuPDF for OCR and text extraction from scanned PDFs

# load  text from image based pdfs using  OCR
def is_scanned_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    for page in doc:
        if page.get_text().strip():
            doc.close()
            return False  # Has text → not scanned
    doc.close()
    return True  # No text → likely scanned



def ingest_document(document):
    """
    PDF → chunks → embeddings → Chroma
    """

    # 1. loading file 
    file_path =  document.file.path
    if is_scanned_pdf(file_path):
        loader = UnstructuredPDFLoader(file_path,poppler_path=config("POPPLER_PATH"),strategy="ocr_only")  # Use OCR-capable loader for scanned PDFs
    else :
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


    vector_store = get_vectorstore()

    # filter out empty chunks (these will produce empty embeddings)
    non_empty_chunks = [c for c in chunks if c.page_content and c.page_content.strip()]

    vector_store.add_documents(non_empty_chunks)
    
    document.processed = True
    document.save()


