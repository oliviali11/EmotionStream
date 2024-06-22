
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
import datetime

client = MongoClient(os.environ.get('mongodb_uri'), server_api=ServerApi('1'))
db = client.get_database("emotionStream")
patients = db.get_collection("patients")
reports = db.get_collection("reports")

def fetch_patients():
    return patients.find()

def fetch_patient(pid):
    return patients.find_one(pid)

def fetch_reports():
    return reports.find()

def fetch_reports_for(pid):
    return reports.find({"pid": pid})

def fetch_report(rid):
    return reports.find_one(rid)

def insert_report(emotion: str, score: float, pid):
    return reports.insert_one({
        "patient_id": pid,
        "timestamp": datetime.datetime.now(datetime.UTC),
        "emotion": emotion,
        "score": score
    })