#Importing necessary libraries
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma

#creating a list that stores PDF path
def process_pdf_and_create_db(file_path, db_persist_directory="./chroma_db"):
    #Load the document
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    #Split the document into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=1000)
    chunks = text_splitter.split_documents(documents)

    #Generate embeddings using Google Gemini
    embeddings = GoogleGenerativeAIEmbeddings(model="text-embedding-004")
    
    #Store embeddings in ChromaDB
    # Chroma can persist the database locally to disk
    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=db_persist_directory
    )
    vector_db.persist() # Ensures the database is saved to disk

    print(f"Vector database created and persisted at {db_persist_directory}")
    return vector_db