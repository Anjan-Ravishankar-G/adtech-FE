import requests
import os
from dotenv import load_dotenv
import refresh_token

load_dotenv()

# Configuration
api_url = os.getenv("API_URL") + "/sp/targets/keywords/recommendations"
access_token = refresh_token.refresh_access_token()
profile_id = os.getenv("Amazon-Advertising-API-Scope")
client_id = os.getenv("CLIENT_ID")

header = {
    "Amazon-Advertising-API-ClientId": client_id,
    "Authorization": f"Bearer {access_token}",
    "Amazon-Advertising-API-Scope": profile_id,
    "Content-Type": "application/vnd.spkeywordsrecommendation.v5+json"
}


def get_recommended_keywords(campaign_id, ad_group_id):
    body = {
        "sortDimension": "CLICKS",
        "maxRecommendations": "5",
        "locale": "en-IN",
        "campaignId": campaign_id,
        "recommendationType": "KEYWORDS_FOR_ADGROUP",
        "adGroupId": ad_group_id
    }
    
    try:
        response = requests.post(api_url, json=body, headers=header)
        response.raise_for_status()  # Raises HTTPError for bad responses
        
        data = response.json()

        if "keywordTargetList" in data:
            keyword_dict = {}

            for item in data["keywordTargetList"]:
                keyword = item.get("keyword")
                bid_info_list = item.get("bidInfo", [])

                if keyword not in keyword_dict:
                    keyword_dict[keyword] = {
                        "matchTypes": [],
                        "bids": [],
                        "rank": None,
                        "theme": None
                    }

                for bid_info in bid_info_list:
                    match_type = bid_info.get("matchType")
                    bid = bid_info.get("bid", 0) / 100  # Convert bid to proper value
                    rank = bid_info.get("rank")
                    theme = bid_info.get("theme")

                    if match_type not in keyword_dict[keyword]["matchTypes"]:
                        keyword_dict[keyword]["matchTypes"].append(match_type)

                    keyword_dict[keyword]["bids"].append(bid)

                    
                    if keyword_dict[keyword]["rank"] is None:
                        keyword_dict[keyword]["rank"] = rank
                    if keyword_dict[keyword]["theme"] is None:
                        keyword_dict[keyword]["theme"] = theme

            result = [
                {
                    "keyword": k,
                    "matchTypes": v["matchTypes"],
                    "bids": v["bids"],
                    "rank": v["rank"],
                    "theme": v["theme"]
                } 
                for k, v in keyword_dict.items()
            ]

          
            return result
        
        else:
            print("Error: 'keywordTargetList' not found in the response data.")
            return []

    except requests.exceptions.RequestException as e:
        print(f"Error fetching recommended keywords: {e}")
        return []

