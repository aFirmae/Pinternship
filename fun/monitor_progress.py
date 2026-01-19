import requests
import json
import time
import os
from dotenv import load_dotenv
from datetime import datetime, date

load_dotenv()

# API Configuration
API_URL = os.getenv("API_ENDPOINT")
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
    name = data.get("Name", "Unknown")
    rank = data.get("Rank", "N/A")
    vibe = data.get("Vibe Progress", 0)
    case_study = data.get("Case Study Progress", 0)
    hp = data.get("Health Points", 0)
    if hp == "": hp = 0
    overall = data.get("Overall Progress", 0)
    
    title = "Internship Progress Update" if is_update else "Current Internship Progress"
    
    # Format the message
    message = (
        f"{name} (🏆 #{rank})\n\n"
        f"✨ ViBe: {vibe}%\n"
        f"📚 Case Study: {case_study}%\n"
        f"❤️ Health Points: {hp}\n"
        f"🚀 Overall: {overall}%"
    )
    
    priority = "high" if is_update else "default"
    
    headers = {
        "Title": title,
        "Priority": priority,
        "Tags": "chart_with_upwards_trend,rocket"
    }
    
    try:
        requests.post(NTFY_URL, data=message.encode('utf-8'), headers=headers)
        print(f"Notification sent to {NTFY_URL}")
    except Exception as e:
        print(f"Error sending notification: {e}")

def check_attendance_reminder(last_state):
    """
    Checks if an attendance reminder should be sent.
    Notification should be sent:
    - On weekdays (Mon-Sat, i.e., 0-5)
    - Between 6 PM and 7 PM (hour == 18)
    - If not already sent today
    """
    now = datetime.now()
    
    # Sunday is 6
    if now.weekday() == 6:
        return False
        
    # Check time window (6 PM - 6:59 PM)
    if now.hour != 18:
        return False
        
    today_str = str(date.today())
    last_reminder = last_state.get("last_attendance_reminder") if last_state else None
    
    if last_reminder == today_str:
        return False
        
    # Send notification
    try:
        headers = {
            "Title": "Attendance Reminder",
            "Priority": "high",
            "Tags": "calendar,memo"
        }
        message = "Don't forget to fill the attendance form today!"
        requests.post(NTFY_URL, data=message.encode('utf-8'), headers=headers)
        print(f"Attendance reminder sent to {NTFY_URL}")
        return True
    except Exception as e:
        print(f"Error sending attendance reminder: {e}")
        return False

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
            send_notification(current_data, is_update=True)
            save_state(current_data)
        else:
            print("No changes detected, but sending heartbeat.")
            send_notification(current_data, is_update=False)

        # Check for attendance reminder
        if check_attendance_reminder(last_state):
            current_data["last_attendance_reminder"] = str(date.today())
            save_state(current_data)
        elif last_state and "last_attendance_reminder" in last_state:
            # Preserve the last reminder date if we didn't send a new one
            current_data["last_attendance_reminder"] = last_state["last_attendance_reminder"]
            save_state(current_data)

    else:
        print("User not found or API error.")

if __name__ == "__main__":
    main()
