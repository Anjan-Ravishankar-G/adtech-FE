import requests
BRIGHTDATA_API_URL = "https://api.brightdata.com/datasets/v3/trigger"
BRIGHTDATA_API_KEY = "d2edcf5e3f0749d8a7c6d39f4df331946c5a353104358818a6a651bf4157b9c8"
DATASET_ID = "gd_l7q7dkf244hwjntr0"

headers = {
    "Authorization": f"Bearer {BRIGHTDATA_API_KEY}",
    "Content-Type": "application/json"
}

def trigger_dataset(url: str):
    payload = [{"url": url}]
    response = requests.post(
        f"{BRIGHTDATA_API_URL}?dataset_id={DATASET_ID}&include_errors=true",
        headers=headers,
        json=payload
    )
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    snapshot_id = response.json().get("snapshot_id")
    print(snapshot_id)
    return snapshot_id
