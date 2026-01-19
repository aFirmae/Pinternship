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

def is_quiet_hours():
    """Returns True if current time is between 1 AM and 6 AM."""
    now = datetime.now()
    # 01:00 to 05:59 (inclusive)
    return 1 <= now.hour < 6

def send_notification(data, is_update=False):
    if is_quiet_hours():
        print("Quiet hours active. Skipping notification.")
        return

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
        "Title": title.encode('utf-8'),
        "Priority": priority,
        "Tags": "chart_with_upwards_trend,rocket"
    }
    
    try:
        requests.post(NTFY_URL, data=message.encode('utf-8'), headers=headers)
        print(f"Notification sent to {NTFY_URL}")
    except Exception as e:
        print(f"Error sending notification: {e}")

def send_hp_notification(new_val, old_val):
    try:
        new_val_float = float(new_val)
        old_val_float = float(old_val)
        diff = new_val_float - old_val_float
    except ValueError:
        diff = 0

    if diff > 0:
        title = "❤️ Health Points Increased! 🎉"
        message = f"Great work! Your Health Points went up by {diff:g} to {new_val}. Keep maintaining the streak!"
        tags = "tada,chart_with_upwards_trend, heart"
        priority = "default"
    elif diff < 0:
        title = "❤️ Health Points Dropped 📉"
        message = f"Don't worry, you can recover them! Your Health Points dropped by {abs(diff):g} to {new_val}. Check what happened and bounce back!"
        tags = "warning,muscle,heart"
        priority = "high"
    else:
        # Should not happen if called correctly on change, but fallback
        title = "Health Points Update"
        message = f"❤️ Health Points updated: {new_val}"
        tags = "heart"
        priority = "default"

    headers = {
        "Title": title.encode('utf-8'),
        "Priority": priority,
        "Tags": tags
    }
    
    try:
        requests.post(NTFY_URL, data=message.encode('utf-8'), headers=headers)
        print(f"HP Notification sent to {NTFY_URL}")
    except Exception as e:
        print(f"Error sending HP notification: {e}")

def send_stagnation_notification():
    if is_quiet_hours():
        print("Quiet hours active. Skipping stagnation notification.")
        return

    headers = {
        "Title": "Keep Progressing!".encode('utf-8'),
        "Priority": "default",
        "Tags": "muscle,warning"
    }
    message = "It's been 24 hours without progress on ViBe or Case Study. Keep going!"
    
    try:
        requests.post(NTFY_URL, data=message.encode('utf-8'), headers=headers)
        print(f"Stagnation Notification sent to {NTFY_URL}")
    except Exception as e:
        print(f"Error sending stagnation notification: {e}")

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
        if last_state is None:
            last_state = {}

        # 1. Check for Progress Changes (Vibe, Case Study, Overall)
        progress_changed = False
        # Initialize loop_vars from last_state, defaulting to current time if new
        now_ts = time.time()
        
        # Keys to monitor for main notification
        monitor_keys = ["Vibe Progress", "Case Study Progress", "Overall Progress"]
        
        for key in monitor_keys:
            if str(current_data.get(key)) != str(last_state.get(key)):
                progress_changed = True
                break
        
        if progress_changed:
            print("Progress change detected!")
            send_notification(current_data, is_update=True)
            # Update timestamps for specific progress metrics
            if str(current_data.get("Vibe Progress")) != str(last_state.get("Vibe Progress")):
                current_data["last_vibe_change_ts"] = now_ts
            else:
                current_data["last_vibe_change_ts"] = last_state.get("last_vibe_change_ts", now_ts)
                
            if str(current_data.get("Case Study Progress")) != str(last_state.get("Case Study Progress")):
                current_data["last_casestudy_change_ts"] = now_ts
            else:
                current_data["last_casestudy_change_ts"] = last_state.get("last_casestudy_change_ts", now_ts)
        else:
            print("No progress changes.")
            # Carry over timestamps
            current_data["last_vibe_change_ts"] = last_state.get("last_vibe_change_ts", now_ts)
            current_data["last_casestudy_change_ts"] = last_state.get("last_casestudy_change_ts", now_ts)
            
            send_notification(current_data, is_update=False)

        # 2. Check for Health Points Change (Separate Notification)
        if str(current_data.get("Health Points")) != str(last_state.get("Health Points")):
            print("Health Points change detected!")
            send_hp_notification(current_data.get("Health Points"), last_state.get("Health Points", 0))

        # 3. Check for Stagnation (24h no progress on Vibe OR Case Study)
        last_vibe_ts = current_data.get("last_vibe_change_ts", now_ts)
        last_casestudy_ts = current_data.get("last_casestudy_change_ts", now_ts)
        
        hours_since_vibe = (now_ts - last_vibe_ts) / 3600
        hours_since_casestudy = (now_ts - last_casestudy_ts) / 3600
        
        if hours_since_vibe >= 24 and hours_since_casestudy >= 24:
            # Check if we should suppress due to 0 or 100 values
            try:
                vibe_val = float(current_data.get("Vibe Progress", 0))
                case_val = float(current_data.get("Case Study Progress", 0))
                
                # Ignore if progress is 0 (not started) or 100 (completed)
                if vibe_val in [0, 100] or case_val in [0, 100]:
                     pass 
                else:
                    # Check if we already sent a stagnation warning recently
                    last_stagnation_sent = last_state.get("last_stagnation_sent_ts", 0)
                    if (now_ts - last_stagnation_sent) > 24 * 3600: # Send once every 24h
                        print("Stagnation detected (24h+). Sending reminder.")
                        send_stagnation_notification()
                        current_data["last_stagnation_sent_ts"] = now_ts
                    else:
                        current_data["last_stagnation_sent_ts"] = last_stagnation_sent
            except ValueError:
                print("Error parsing progress values for stagnation check")
        else:
            current_data["last_stagnation_sent_ts"] = last_state.get("last_stagnation_sent_ts", 0)


        # 4. Check Attendance
        if check_attendance_reminder(last_state):
            current_data["last_attendance_reminder"] = str(date.today())
        elif last_state and "last_attendance_reminder" in last_state:
            current_data["last_attendance_reminder"] = last_state["last_attendance_reminder"]

        # Save new state
        save_state(current_data)

    else:
        print("User not found or API error.")

if __name__ == "__main__":
    main()
