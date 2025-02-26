import requests
import os
from dotenv import load_dotenv
import refresh_token 


def get_negative_keywords():
    
    load_dotenv()  
    
    api_url = os.getenv("API_URL") + "/sp/negativeKeywords/list" 
    access_token = refresh_token.refresh_access_token()
    profile_id = os.getenv("Amazon-Advertising-API-Scope")
    client_id = os.getenv("CLIENT_ID")
    
    
    # Request Headers
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Amazon-Advertising-API-Scope": profile_id,
        "Amazon-Advertising-API-ClientId": client_id,
        "Accept": "application/vnd.spNegativeKeyword.v3+json",
         "Content-Type": "application/vnd.spNegativeKeyword.v3+json"
    }
    
    payload = {
        
    }
    
    try:
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        
        data = response.json()
        negative_keywords = []
        for keyword in data.get('negativeKeywords', []):
                negative_keywords.append({
                    'campaignId': keyword.get('campaignId'),
                    'adGroupId': keyword.get('adGroupId'),
                    'keywordId': keyword.get('keywordId'),
                    'keywordText': keyword.get('keywordText'),
                    'matchType': keyword.get('matchType')
                })
        return negative_keywords
        
    except requests.exceptions.RequestException as e:
        if hasattr(e, 'response') and e.response is not None:
            print("Error details:", e.response.text)


