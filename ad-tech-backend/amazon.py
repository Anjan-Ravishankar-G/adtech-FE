

def get_product_details():
    best_sellers_rank = next(
        (item['value'] for item in data.get('product_details', []) 
         if item.get('type') == 'Best Sellers Rank'), 
        'N/A'
    )

    # Prepare the output dictionary
    product_details = {
        'title': data.get('title', 'N/A'),
        'reviews_count': data.get('reviews_count', 'N/A'),
        'top_review': data.get('top_review', 'N/A'),
        'seller_name': data.get('seller_name', 'N/A'),
        'initial_price': data.get('initial_price', 'N/A'),
        'currency': data.get('currency', 'N/A'),
        'categories': data.get('categories', []),
        'asin': data.get('asin', 'N/A'),
        'buybox_seller': data.get('buybox_seller', 'N/A'),
        'root_bs_rank': data.get('root_bs_rank', 'N/A'),
        'discount': None,  # There's no direct discount field in this data
        'buybox_prices': data.get('buybox_prices', {}),
        'description': data.get('description', 'N/A'),
        'number_of_sellers': data.get('number_of_sellers', 'N/A'),
        'best_sellers_rank': best_sellers_rank
    }
    
    return product_details