import requests

def get_snapshot_id():
    api_url = "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7q7dkf244hwjntr0&include_errors=true"
    headers = {
        "Authorization": "Bearer d2edcf5e3f0749d8a7c6d39f4df331946c5a353104358818a6a651bf4157b9c8",
        "Content-Type": "application/json"
    }

    # Correct the body structure to match the expected format
    body = {
        "url": "https://www.amazon.in/SM-M166P/dp/B0DX798LW2?ref=dlx_deals_dg_dcl_B0DX798LW2_dt_sl10_56_pi&pf_rd_r=0TTT795KJQJZTQM3FBFK&pf_rd_p=065cd315-6c3e-4e79-8380-82c4417b9956",
        "asin": "",  
        "zipcode": ""  
    }

    try:
        # Send the request with the corrected body
        response = requests.post(api_url, headers=headers, json=body)
        print(response.json())
    except requests.RequestException as e:
        print(f"Request failed: {e}")

get_snapshot_id()
