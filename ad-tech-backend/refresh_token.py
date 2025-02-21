import requests 
import json 
import os
from dotenv import load_dotenv
#variables 
client_id ="amzn1.application-oa2-client.a8a8bd20c4e04fa5b31dd32b7efcf585"
Client_secret = "amzn1.oa2-cs.v1.0f0548641d036b0a0f1eec9f36fe4ab936c03b99f0541802d04973c82fad505e"
Refresh_token = "Atzr|IwEBIAlWJc9H68rdIGbm1qp_kOvQguVSCEwNz8MW2rJNfkSaupKXz5Eq6MxzuJ_saCSqphHY7ahz_U39yykL6zqFQyJSrWEmUBdqXBLZ-AWVk2e-vq5hQ9Zih6Mb_BzLUT5BblLl7Xm1t1n8qvspvbYvBkWKXEEOjvRKpw5pumwueuE1q18RPjSHMfkYGlyGk2dIFzaKbuvpws0izXj6N3VswGRBqC35N6ZbPpHxRmcgF0basiE8oWkIZuCdxOl5BsayJ-QrBcJ5xGhghENUa2dRJaZ1RqF4JvQgAv3B3cDvZK3S8vWq8JR55Nfxs-pztS5j0beTx4_1_2dOK0DAa2s1ZPgiAd8n3-PyAeWhIxrCcuob3nImaKcrer54UGwwWMpsXqyRxLZfjKgDapDACcNUBgo9gc6yHPvMPyClb4-AOu-BwjUolyvcKlrne0Rk_isE5iX6DoYnyaEi3jNQNDyLCC5RyMJCv16K58akPpTJx_6qRPWF6hRsZelCJ7LmYAPSbK4RnYrTpddtQkLN-TS1Lfhs"
Token_url = "https://api.amazon.com/auth/o2/token"

def refresh_access_token():
    datas = {
        "grant_type": "refresh_token",
        "refresh_token": Refresh_token,
        "client_id": client_id,
        "client_secret": Client_secret,
    }

    response = requests.post(Token_url, data=datas)
    if response.status_code == 200:
        token = response.json()
        print(token.get("access_token"))
        return token.get("access_token")
        
    else:
        print("Error while refreshing the token:", response.text)
        return None

if __name__ == "__main__":
    token = refresh_access_token()

    