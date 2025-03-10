import requests
import os
from dotenv import load_dotenv
import refresh_token 

def get_brand_details():
    
    load_dotenv()  
    
    api_url = os.getenv("API_URL") + "/v2/profiles" 
    access_token = refresh_token.refresh_access_token()
    client_id = os.getenv("CLIENT_ID")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Amazon-Advertising-API-ClientId": client_id
    }
     
    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
        profiles = response.json()
        
        # Extracting the required data into a list of dictionaries
        profile_data = [
            {
                "profileId": profile.get("profileId"),
                "currencyCode": profile.get("currencyCode"),
                "name": profile.get("accountInfo", {}).get("name")
            }
            for profile in profiles
        ]
        
        return profile_data
    
    except requests.exceptions.RequestException as e:
        if hasattr(e, 'response') and e.response is not None:
            print("Error details:", e.response.text)
        else:
            print(f"An error occurred: {e}")
        return []