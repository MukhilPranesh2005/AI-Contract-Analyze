from pymongo import MongoClient
from app.config import MONGODB_URI, DATABASE_NAME

client = MongoClient(MONGODB_URI)

db = client[DATABASE_NAME]

documents_collection = db["documents"]
analysis_collection = db["analysis"]
chat_collection = db["chat_history"]