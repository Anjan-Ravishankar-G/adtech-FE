from fastapi import FastAPI, HTTPException
import pymysql
from typing import List, Dict
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import keyword_recommendation
import negative_keyword
import amazonScraping
load_dotenv()  # Load .env variables

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": int(os.getenv("DB_PORT", "3306")), 
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_DATABASE"),
    "cursorclass": pymysql.cursors.DictCursor,
}


def get_db_connection():
    try:
        return pymysql.connect(**DB_CONFIG)
    except pymysql.MySQLError as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")

# Function to fetch report
def get_report(table_name) -> List[Dict]:
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM {table_name}")
            result = cursor.fetchall()
        connection.close()
        return result
    except pymysql.MySQLError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/get_report/{table_name}", response_model=List[Dict])
def fetch_campaign_report(table_name: str):
    report_data = get_report(table_name)
    if not report_data:
        raise HTTPException(status_code=404, detail="No data found")
    return report_data

# Function to fetch latest brand data
def get_latest_brand_report() -> List[Dict]:
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT Brand, DateTime, DailySales, Target, TargetAchieved
                FROM brand_level_table AS t1
                WHERE DateTime = (
                    SELECT MAX(DateTime) FROM brand_level_table AS t2 WHERE t1.Brand = t2.Brand
                )
            """)
            result = cursor.fetchall()
        connection.close()
        return result
    except pymysql.MySQLError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/get_unique/brand_level_table", response_model=List[Dict])
def fetch_latest_brand_report():
    report_data = get_latest_brand_report()
    if not report_data:
        raise HTTPException(status_code=404, detail="No data found")
    return report_data

def get_filtered_report_by_dates(start_date: str, end_date: str) -> List[Dict]:
    try:
        connection = pymysql.connect(**DB_CONFIG)
        with connection.cursor() as cursor:
            query = """
                SELECT Brand, 
                       AVG(DailySales) AS DailySales,
                       AVG(TargetAchieved) AS TargetAchieved,
                       AVG(Target) AS Target
                FROM brand_level_table
                WHERE STR_TO_DATE(DateTime, '%%Y-%%m-%%d %%H:%%i') BETWEEN %s AND %s
                GROUP BY Brand
                ORDER BY DailySales DESC
                LIMIT 5
            """
            cursor.execute(query, (start_date, end_date))
            result = cursor.fetchall()
        connection.close()

        return result

    except pymysql.MySQLError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/get_filtered_brands", response_model=List[Dict])
def fetch_filtered_brands(start_date: str, end_date: str):
    """
    Fetches brands from the database filtered by the given date range.
    """
    report_data = get_filtered_report_by_dates(start_date, end_date)
    if not report_data:
        raise HTTPException(status_code=404, detail="No data found for the given date range")
    return report_data



# Endpoint for fetching recommended keywords
@app.get("/keyword/recommendation/{campaign_id}/{ad_group_id}", response_model=List[Dict])
def get_keyword_recommendation(campaign_id: str, ad_group_id: str):
    # Fetch the recommended keywords using the helper function
    keywords = keyword_recommendation.get_recommended_keywords(campaign_id, ad_group_id)
    print(keywords)
    # If no keywords found, raise a 404 error
    if not keywords:
        raise HTTPException(status_code=404, detail="No keywords found")
    
    # Return the filtered list directly to the frontend
    return keywords

@app.get("/negative_keywords", response_model=List[Dict])
def get_negative_keywords():
    list_of_keyowrd = negative_keyword.get_negative_keywords()

    if not list_of_keyowrd:
        raise HTTPException(status_code=404, detail="No keywords found")
    return list_of_keyowrd



#for the research part 
#amazon scraping 

@app.get("/scrap/{asin}")
def get_amazon_scrap(asin: str):
    data = amazonScraping.scrape_amazon_product(asin)
    if not data:
        raise HTTPException(status_code=404, detail="No details found")
    print(data)
    return data