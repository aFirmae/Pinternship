import requests
import json
import time
import os
from datetime import datetime

# API Configuration
API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiNLqk6T4z32vhEcYlQkt7MVoo05bbzkQ-nhzoQXlQquTIFdOQ3FfX_KG5h5tGs2KaZdA80qbXFHgh-bkXt2BiesOHgD0gKtKxrm-0WF1Msbx3zZh_ucp8QxzyDOgNkv0irffMbYL42IxGS2nMc2c816mrOFBoYy44xNWnOu4zxUJBPRl3BBfrEKOFYsbbdYR9Bbb7x1kDJNc3rwqkf1CLjGh8ZE7HK8nQen2YhCccnexslS8nYw8aSbJAJS9jHTksgHITCOKf0cVAZ-F3Zxq2h0xY7MPGQ6IhA83Oa&lib=MrxF4XVZAGhT6Ne_8shS_QrG2wkm5YvMt"
TARGET_NAME = "Nilashis Saha"

# Notification Configuration (NTFY.sh)
# Topic must be unique enough. Users can subscribe to this topic on the Ntfy app.
NTFY_TOPIC = "Pinternship"
NTFY_URL = f"https://ntfy.sh/{NTFY_TOPIC}"

# State file to store last known progress
STATE_FILE = ".progress_state.json"
POLL_INTERVAL_SECONDS = 600  # Check every 10 minutes

def fetch_data():
    try:
        response = requests.get(API_URL, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        # Navigate to dashboard list
        if isinstance(data, dict):
            # Based on previous analysis, data is in 'dashboard' key
            records = data.get('dashboard', [])
            if not records and 'data' in data: # Fallback
                records = data['data']
        elif isinstance(data, list):
            records = data
        else:
            records = []
            
        for item in records:
            if TARGET_NAME.lower() in str(item.get('Name', '')).lower():
                return item
        return None
        
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def send_notification(data, is_update=False):
    # Format the message
    # Nilashis Saha
    # Vibe Progress - x amount
    # Case Study Progress - x amount
    # Health Points - x points
    # Overall Progress - x amount
    
    name = data.get("Name", "Unknown")
    vibe = data.get("Vibe Progress", 0)
    case_study = data.get("Case Study Progress", 0)
    hp = data.get("Health Points", 0)
    if hp == "": hp = 0
    overall = data.get("Overall Progress", 0)
    rank = data.get("Rank", "N/A")
    
    title = "Internship Progress Update" if is_update else "Current Internship Progress"
    
    message = (
        f"{name}\n"
        f"Vibe Progress: {vibe}\n"
        f"Case Study Progress: {case_study}\n"
        f"Health Points: {hp}\n"
        f"Overall Progress: {overall}\n"
        f"(Rank: {rank})"
    )
    
    headers = {
        "Title": title,
        "Priority": "default" if is_update else "low",
        "Tags": "chart_with_upwards_trend,rocket"
    }
    
    try:
        requests.post(NTFY_URL, data=message.encode('utf-8'), headers=headers)
        print(f"Notification sent to {NTFY_URL}")
    except Exception as e:
        print(f"Error sending notification: {e}")

def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r') as f:
                return json.load(f)
        except:
            return None
    return None

def save_state(data):
    with open(STATE_FILE, 'w') as f:
        json.dump(data, f)

def main():
    print(f"Starting check for {TARGET_NAME} at {datetime.now()}...")
    
    current_data = fetch_data()
    
    if current_data:
        last_state = load_state()
        
        # Check for changes
        has_changed = False
        if last_state:
            # Compare critical fields
            for key in ["Vibe Progress", "Case Study Progress", "Health Points", "Overall Progress"]:
                if str(current_data.get(key)) != str(last_state.get(key)):
                    has_changed = True
                    break
        else:
            has_changed = True # First run
        
        if has_changed:
            print("Change detected or first run!")
            send_notification(current_data, is_update=(last_state is not None))
            save_state(current_data)
        else:
            print("No changes detected.")
    else:
        print("User not found or API error.")

if __name__ == "__main__":
    main()
