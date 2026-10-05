from datetime import datetime


class DocumentModel:

    @staticmethod
    def create(filename, text):

        return {

            "filename": filename,

            "text": text,

            "created_at": datetime.utcnow()

        }