import requests
from bs4 import BeautifulSoup
import json
import time
import random
import re

def scrape_amazon_product(asin):
    url = f"https://www.amazon.in/dp/{asin}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.amazon.com/',
    }
    
    time.sleep(random.uniform(2, 5))  # Delay to avoid blocking
    response = requests.get(url, headers=headers, timeout=15)
    if response.status_code != 200:
        return {"error": f"Failed to fetch page: Status code {response.status_code}"}
    
    soup = BeautifulSoup(response.content, 'html.parser')
    product_data = {
        "asin": asin,
        "url": url,
        "title": None,
        "mrp": None,
        "selling_price": None,
        "discount": None,
        "rating": None,
        "review_count": None,
        "sellers": [],
        "description": None
    }
    
    # Extract title
    title_element = soup.select_one("#productTitle")
    if title_element:
        product_data["title"] = title_element.get_text().strip()
    
    # Extract prices
    price_elements = {
        "mrp": ["#priceblock_ourprice", "#listPrice"],
        "selling_price": [".a-price .a-offscreen", "#priceblock_dealprice", "#priceblock_saleprice"]
    }
    
    for key, selectors in price_elements.items():
        for selector in selectors:
            price_element = soup.select_one(selector)
            if price_element:
                product_data[key] = price_element.get_text().strip()
                break
    
    # Calculate discount
    if product_data["mrp"] and product_data["selling_price"]:
        try:
            mrp = float(re.sub(r'[^0-9.]', '', product_data["mrp"]))
            selling_price = float(re.sub(r'[^0-9.]', '', product_data["selling_price"]))
            product_data["discount"] = f"{round(((mrp - selling_price) / mrp) * 100, 2)}% off"
        except ValueError:
            product_data["discount"] = None
    
    # Extract rating
    rating_element = soup.select_one("#acrPopover span.a-icon-alt")
    if rating_element:
        product_data["rating"] = rating_element.get_text().split()[0]
    
    # Extract review count
    review_element = soup.select_one("#acrCustomerReviewText")
    if review_element:
        product_data["review_count"] = review_element.get_text().split()[0].replace(',', '')
    
    # Extract sellers
    seller_elements = soup.select("#merchant-info, #bylineInfo")
    for seller in seller_elements:
        seller_text = seller.get_text().strip()
        if seller_text and seller_text not in product_data["sellers"]:
            product_data["sellers"].append(seller_text)
    
    # Extract full description from multiple sections
    description_sections = [
        "#productDescription",                   # Main product description
        "#feature-bullets",                      # Bullet points
        "#productOverview_feature_div",          # Overview features
        "#productDetails_techSpec_section_1",    # Technical details
        "#productDetails_detailBullets_sections1" # Additional product details
    ]

    descriptions = []
    for selector in description_sections:
        desc_element = soup.select_one(selector)
        if desc_element:
            descriptions.append(' '.join(desc_element.stripped_strings))

    product_data["description"] = " ".join(descriptions).strip() if descriptions else None
    
    return product_data