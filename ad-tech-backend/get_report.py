from fastapi import FastAPI, HTTPException
import pymysql
from typing import List, Dict
import keyword_recommendation
app = FastAPI()
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Database connection details
DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_DATABASE"),
    "cursorclass": pymysql.cursors.DictCursor
}

# Function to fetch  report
def get_report(table_name) -> List[Dict]:
    try:
        connection = pymysql.connect(**DB_CONFIG)
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {table_name} ")
            result = cursor.fetchall()
        connection.close()
        return result
    except pymysql.MySQLError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/get_report/{table_name}", response_model=List[Dict])
def fetch_campaign_report(table_name : str):
    report_data = get_report(table_name)
    if not report_data:
        raise HTTPException(status_code=404, detail="No data found")
    return report_data



@app.get("/keyword/recommendation/{campaign_id}/{ad_group_id}", response_model=List[Dict])
def get_keyword_recommendation(campaign_id: str, ad_group_id: str):
    # Fetch the recommended keywords using the helper function
    keywords = keyword_recommendation.get_recommended_keywords(campaign_id, ad_group_id)
    
    # If no keywords found, raise a 404 error
    if not keywords:
        raise HTTPException(status_code=404, detail="No keywords found")
    
    # Return the filtered list directly to the frontend
    return keywords

