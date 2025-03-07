from fastapi import FastAPI, HTTPException
import pymysql
from typing import List, Dict
import time 
import os
import requests
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import keyword_recommendation
import negative_keyword
from urllib.parse import urlencode
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



# Base URL for SerpAPI
SERPAPI_URL = "https://serpapi.com/search.json"



#interest over time 
@app.get("/interestOverTime")
async def get_serpapi_data(q: str, data_type: str = "TIMESERIES", api_key: str = "ee9e5cc7b59c3c63dd11dc37c2e93618c8bd3c2a3fc0c670cd7ae50bc81f88ab", hl: str = "en"):
    params = {
        "engine": "google_trends",
        "hl": hl,
        "q": q,
        "data_type": data_type,
        "api_key": api_key
    }

    endpoint = f"{SERPAPI_URL}?{urlencode(params)}"
    response = requests.get(endpoint)

    if response.status_code == 200:
        data = response.json()
        transformed_data = []
        if "interest_over_time" in data and "timeline_data" in data["interest_over_time"]:
            for time_point in data["interest_over_time"]["timeline_data"]:
                entry = {
                    "date": time_point["date"]
                }
                for value_data in time_point["values"]:
                    entry[value_data["query"]] = value_data["extracted_value"]
                transformed_data.append(entry)
        return transformed_data
    else:
        return {"error": f"Error: {response.status_code}", "message": response.text}


#compared by 
@app.get("/comparedBy")
def get_formatted_geographic_interest(
    q: str,
    data_type: str = "GEO_MAP",
    api_key: str = "ee9e5cc7b59c3c63dd11dc37c2e93618c8bd3c2a3fc0c670cd7ae50bc81f88ab",
    hl: str = "en",
    geo: str = "IN",
):
    
    params = {
        "engine": "google_trends",
        "q": q,
        "data_type": data_type,
        "api_key": api_key,
        "hl": hl,
        "geo": geo,
        "geo_level": "city"
    }
    
    try:
        response = requests.get(SERPAPI_URL, params=params)
        
        if response.status_code != 200:
            return {"error": f"Error: {response.status_code}", "message": response.text}
        
        data = response.json()
        
        keywords = [k.strip() for k in q.split(",")]
        
        result = {
            "keywords": keywords,
            "locations": []
        }
        
        if "compared_breakdown_by_region" in data:
            for region in data["compared_breakdown_by_region"]:
                location_data = {
                    "name": region.get("location", ""),
                    "code": region.get("geo", ""),
                    "values": {}
                }
                
                if "values" in region:
                    for value_item in region["values"]:
                        if "query" in value_item and "extracted_value" in value_item:
                            query = value_item["query"]
                            value = value_item["extracted_value"]
                            location_data["values"][query] = value
                
                result["locations"].append(location_data)
        
        return result
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data from SerpAPI: {str(e)}")


@app.get("/relatedQueries")
async def get_related_queries(q: str="headphone, samsung", data_type: str = "RELATED_QUERIES",
    api_key: str = "ee9e5cc7b59c3c63dd11dc37c2e93618c8bd3c2a3fc0c670cd7ae50bc81f88ab", hl: str = "en", geo: str= "GEO_MAP"):
    
    params = {
        "engine": "google_trends",
        "q": q,
        "data_type": data_type,
        "api_key": api_key,
    }
    try:
        # Send the GET request
        response = requests.get(SERPAPI_URL, params=params)
        response.raise_for_status()  # Raise exception for non-200 status codes
        
        data = response.json()
        
        # Transform the data into a structured format
        result = {}
        
        # Extract search terms from the query
        search_terms = [term.strip() for term in q.split(",")]
        
        # Process the related queries data
        if "related_queries" in data:
            related_data = data["related_queries"]
            
            for term in search_terms:
                term_data = {}
                
                # Check if this term has data in the response
                if term in related_data:
                    term_info = related_data[term]
                    
                    # Process top queries if available
                    if "top" in term_info:
                        term_data["top"] = [
                            {
                                "query": item.get("query", ""),
                                "value": item.get("value", 0),
                                "link": item.get("link", "")
                            }
                            for item in term_info["top"]
                        ]
                    
                    # Process rising queries if available
                    if "rising" in term_info:
                        term_data["rising"] = [
                            {
                                "query": item.get("query", ""),
                                "value": item.get("value", 0),
                                "link": item.get("link", "")
                            }
                            for item in term_info["rising"]
                        ]
                
                result[term] = term_data
        
        return result
        
    except requests.exceptions.RequestException as e:
        return {"error": f"Error: {response.status_code}", "message": response.text}



@app.get("/multiQueryRelatedQueries")
async def get_multiple_related_queries(
    keywords: str,  # Required parameter for comma-separated keywords
    data_type: str = "RELATED_QUERIES",
    api_key: str = "ee9e5cc7b59c3c63dd11dc37c2e93618c8bd3c2a3fc0c670cd7ae50bc81f88ab",
    hl: str = "en",
    geo: str = "IN"  # Default to India
):
    # Split the keywords
    keyword_list = [k.strip() for k in keywords.split(",")]
    
    # Prepare simplified result dictionary
    result = {}
    
    # Make a separate request for each keyword
    for keyword in keyword_list:
        params = {
            "engine": "google_trends",
            "q": keyword,
            "data_type": data_type,
            "api_key": api_key,
            "hl": hl,
            "geo": geo
        }
        
        try:
            # Send the GET request
            response = requests.get(SERPAPI_URL, params=params)
            
            # Check for errors
            if response.status_code != 200:
                result[keyword] = {"error": f"Error: {response.status_code}"}
                continue
            
            data = response.json()
            
            # Extract only the requested fields
            if "related_queries" in data:
                related_data = data["related_queries"]
                filtered_data = {}
                
                # Process rising queries
                if "rising" in related_data:
                    filtered_data["rising"] = []
                    for item in related_data["rising"]:
                        if "query" in item and "value" in item:
                            filtered_data["rising"].append({
                                "query": item["query"],
                                "value": item["value"]
                            })
                
                # Process top queries
                if "top" in related_data:
                    filtered_data["top"] = []
                    for item in related_data["top"]:
                        if "query" in item and "value" in item:
                            filtered_data["top"].append({
                                "query": item["query"],
                                "value": item["value"]
                            })
                
                result[keyword] = filtered_data
            else:
                result[keyword] = {"error": "No related queries data found"}
                
        except requests.exceptions.RequestException as e:
            result[keyword] = {"error": f"Request error: {str(e)}"}
    
    return result
