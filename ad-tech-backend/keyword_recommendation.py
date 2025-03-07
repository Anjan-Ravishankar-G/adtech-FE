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
        response.raise_for_status()
        data = response.json()
        # Extract required fields
        keyword_data = []
        for item in data.get("keywordTargetList", []):
            keyword = item.get("keyword", "")
            for bid_info in item.get("bidInfo", []):
                theme = "Conversion" if bid_info.get("theme") == "CONVERSION_OPPORTUNITIES" else bid_info.get("theme")
                match_type = bid_info.get("matchType", "")
                rank = bid_info.get("rank", 0)
                bid = round(bid_info.get("bid", 0))
                keyword_data.append({
                    "keyword": keyword,
                    "theme": theme,
                    "match_type": match_type,
                    "rank": rank,
                    "bid": bid
                })
        return keyword_data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching recommended keywords: {e}")
        return []