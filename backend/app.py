"""
Flask Backend for DeviceIQ Analytics Platform
==============================================
This Flask application provides REST API endpoints for the mobile usage analytics dashboard.

Setup Instructions:
1. Create a virtual environment: python -m venv venv
2. Activate it: source venv/bin/activate (Linux/Mac) or venv\Scripts\activate (Windows)
3. Install dependencies: pip install -r requirements.txt
4. Run the server: python app.py

The server will start on http://localhost:5000
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from pathlib import Path
import pickle
from functools import lru_cache

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
DATA_PATH = Path(__file__).parent / 'data' / 'mobile_usage.csv'
MODEL_PATH = Path(__file__).parent / 'models'

# ============ Helper Functions ============

@lru_cache(maxsize=1)
def load_data():
    """Load and cache the mobile usage data"""
    df = pd.read_csv(DATA_PATH)
    return df

def get_aggregated_stats(df):
    """Calculate aggregated statistics from the dataframe"""
    return {
        'totalUsers': len(df),
        'avgAppUsage': float(df['App_Usage_Time'].mean()),
        'avgScreenTime': float(df['Screen_On_Time'].mean()),
        'avgBatteryDrain': float(df['Battery_Drain'].mean()),
        'avgDataUsage': float(df['Data_Usage'].mean()),
        'avgAppsInstalled': float(df['Number_of_Apps_Installed'].mean()),
        'deviceCounts': df['Device_Model'].value_counts().to_dict(),
        'osCounts': df['Operating_System'].value_counts().to_dict(),
        'behaviorCounts': df['User_Behavior_Class'].value_counts().to_dict(),
        'ageGroups': {
            '18-24': len(df[(df['Age'] >= 18) & (df['Age'] <= 24)]),
            '25-34': len(df[(df['Age'] >= 25) & (df['Age'] <= 34)]),
            '35-44': len(df[(df['Age'] >= 35) & (df['Age'] <= 44)]),
            '45-54': len(df[(df['Age'] >= 45) & (df['Age'] <= 54)]),
            '55+': len(df[df['Age'] >= 55]),
        },
        'genderCounts': df['Gender'].value_counts().to_dict(),
    }

def success_response(data, message=None):
    """Standard success response format"""
    response = {'success': True, 'data': data}
    if message:
        response['message'] = message
    return jsonify(response)

def error_response(message, status_code=400, code=None):
    """Standard error response format"""
    response = {'success': False, 'message': message}
    if code:
        response['code'] = code
    return jsonify(response), status_code

# ============ Data Endpoints ============

@app.route('/api/users', methods=['GET'])
def get_all_users():
    """Get all users data"""
    df = load_data()
    users = df.to_dict(orient='records')
    return success_response(users)

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user by ID"""
    df = load_data()
    user = df[df['User_ID'] == user_id]
    if user.empty:
        return error_response(f'User {user_id} not found', 404, 'USER_NOT_FOUND')
    return success_response(user.to_dict(orient='records')[0])

# ============ Analytics Endpoints ============

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get aggregated statistics"""
    df = load_data()
    stats = get_aggregated_stats(df)
    return success_response(stats)

@app.route('/api/analytics/devices', methods=['GET'])
def get_device_distribution():
    """Get device model distribution"""
    df = load_data()
    distribution = df['Device_Model'].value_counts().to_dict()
    return success_response(distribution)

@app.route('/api/analytics/os', methods=['GET'])
def get_os_distribution():
    """Get operating system distribution"""
    df = load_data()
    distribution = df['Operating_System'].value_counts().to_dict()
    return success_response(distribution)

@app.route('/api/analytics/behavior', methods=['GET'])
def get_behavior_distribution():
    """Get user behavior class distribution"""
    df = load_data()
    distribution = df['User_Behavior_Class'].value_counts().to_dict()
    # Convert keys to strings for JSON compatibility
    distribution = {str(k): v for k, v in distribution.items()}
    return success_response(distribution)

@app.route('/api/analytics/demographics', methods=['GET'])
def get_demographics():
    """Get demographic breakdown"""
    df = load_data()
    stats = get_aggregated_stats(df)
    return success_response({
        'ageGroups': stats['ageGroups'],
        'genderCounts': stats['genderCounts'],
    })

# ============ ML Prediction Endpoints ============

@app.route('/api/predict/behavior', methods=['POST'])
def predict_behavior():
    """
    Predict user behavior class based on features
    
    Expected JSON body:
    {
        "device_model": "iPhone 12",
        "operating_system": "iOS",
        "app_usage_time": 300,
        "screen_on_time": 5.5,
        "battery_drain": 1500,
        "number_of_apps_installed": 45,
        "data_usage": 1000,
        "age": 30,
        "gender": "Male"
    }
    """
    data = request.get_json()
    if not data:
        return error_response('No data provided', 400, 'NO_DATA')
    
    # For now, use a simple rule-based prediction
    # Replace this with actual ML model loading and prediction
    app_usage = data.get('app_usage_time', 0)
    screen_time = data.get('screen_on_time', 0)
    
    # Simple heuristic based on usage patterns
    score = (app_usage / 600) * 0.4 + (screen_time / 12) * 0.6
    
    if score < 0.2:
        predicted_class = 1
    elif score < 0.4:
        predicted_class = 2
    elif score < 0.6:
        predicted_class = 3
    elif score < 0.8:
        predicted_class = 4
    else:
        predicted_class = 5
    
    # Generate mock probabilities
    probabilities = {}
    for i in range(1, 6):
        if i == predicted_class:
            probabilities[i] = round(0.5 + np.random.random() * 0.3, 3)
        else:
            probabilities[i] = round(np.random.random() * 0.2, 3)
    
    # Normalize
    total = sum(probabilities.values())
    probabilities = {k: round(v/total, 3) for k, v in probabilities.items()}
    
    return success_response({
        'predicted_class': predicted_class,
        'confidence': probabilities[predicted_class],
        'probabilities': probabilities,
    })

@app.route('/api/predict/usage', methods=['POST'])
def predict_usage():
    """
    Predict usage metrics based on device and demographic features
    
    Expected JSON body:
    {
        "device_model": "iPhone 12",
        "operating_system": "iOS",
        "number_of_apps_installed": 45,
        "age": 30,
        "gender": "Male"
    }
    """
    data = request.get_json()
    if not data:
        return error_response('No data provided', 400, 'NO_DATA')
    
    df = load_data()
    
    # Use dataset statistics as base for predictions
    apps = data.get('number_of_apps_installed', 50)
    age = data.get('age', 30)
    
    # Simple regression-like predictions based on correlations
    base_screen_time = float(df['Screen_On_Time'].mean())
    base_app_usage = float(df['App_Usage_Time'].mean())
    base_data_usage = float(df['Data_Usage'].mean())
    base_battery = float(df['Battery_Drain'].mean())
    
    # Adjust based on apps installed (more apps = more usage)
    apps_factor = apps / df['Number_of_Apps_Installed'].mean()
    
    # Adjust based on age (younger = slightly more usage)
    age_factor = 1.2 if age < 30 else (1.0 if age < 45 else 0.8)
    
    predictions = {
        'predicted_screen_time': round(base_screen_time * apps_factor * age_factor, 2),
        'predicted_app_usage': round(base_app_usage * apps_factor * age_factor, 0),
        'predicted_data_usage': round(base_data_usage * apps_factor, 0),
        'predicted_battery_drain': round(base_battery * apps_factor, 0),
    }
    
    return success_response(predictions)

# ============ Simulation Endpoint ============

@app.route('/api/simulate', methods=['POST'])
def simulate():
    """
    Run what-if scenario simulation
    
    Expected JSON body:
    {
        "base_user_id": 1,
        "changes": {
            "apps_installed_delta": 10,
            "device_model": "iPhone 12",
            "operating_system": "iOS"
        }
    }
    """
    data = request.get_json()
    if not data:
        return error_response('No data provided', 400, 'NO_DATA')
    
    df = load_data()
    user_id = data.get('base_user_id')
    changes = data.get('changes', {})
    
    user = df[df['User_ID'] == user_id]
    if user.empty:
        return error_response(f'User {user_id} not found', 404, 'USER_NOT_FOUND')
    
    user_data = user.iloc[0]
    
    # Original values
    original = {
        'behavior_class': int(user_data['User_Behavior_Class']),
        'screen_time': float(user_data['Screen_On_Time']),
        'battery_drain': float(user_data['Battery_Drain']),
        'data_usage': float(user_data['Data_Usage']),
    }
    
    # Apply changes and predict new values
    apps_delta = changes.get('apps_installed_delta', 0)
    new_apps = user_data['Number_of_Apps_Installed'] + apps_delta
    
    # Simple prediction based on correlation with apps
    apps_ratio = new_apps / user_data['Number_of_Apps_Installed'] if user_data['Number_of_Apps_Installed'] > 0 else 1
    
    predicted = {
        'behavior_class': min(5, max(1, int(original['behavior_class'] + apps_delta // 15))),
        'screen_time': round(original['screen_time'] * (apps_ratio ** 0.3), 2),
        'battery_drain': round(original['battery_drain'] * (apps_ratio ** 0.5), 0),
        'data_usage': round(original['data_usage'] * (apps_ratio ** 0.4), 0),
    }
    
    # Calculate changes
    change_values = {
        'behavior_class': predicted['behavior_class'] - original['behavior_class'],
        'screen_time': round(predicted['screen_time'] - original['screen_time'], 2),
        'battery_drain': round(predicted['battery_drain'] - original['battery_drain'], 0),
        'data_usage': round(predicted['data_usage'] - original['data_usage'], 0),
    }
    
    return success_response({
        'original': original,
        'predicted': predicted,
        'changes': change_values,
    })

# ============ Role-Specific Insights ============

@app.route('/api/insights/individual/<int:user_id>', methods=['GET'])
def get_individual_insights(user_id):
    """Get personalized insights for an individual user"""
    df = load_data()
    user = df[df['User_ID'] == user_id]
    
    if user.empty:
        return error_response(f'User {user_id} not found', 404, 'USER_NOT_FOUND')
    
    user_data = user.iloc[0]
    
    # Calculate percentiles
    percentiles = {
        'screen_time': float((df['Screen_On_Time'] <= user_data['Screen_On_Time']).mean() * 100),
        'app_usage': float((df['App_Usage_Time'] <= user_data['App_Usage_Time']).mean() * 100),
        'data_usage': float((df['Data_Usage'] <= user_data['Data_Usage']).mean() * 100),
        'battery_drain': float((df['Battery_Drain'] <= user_data['Battery_Drain']).mean() * 100),
    }
    
    # Calculate wellness score (lower usage = higher score)
    wellness_score = max(0, min(100, 100 - (user_data['Screen_On_Time'] / 12 * 100)))
    
    # Generate recommendations
    recommendations = []
    if user_data['Screen_On_Time'] > df['Screen_On_Time'].median():
        recommendations.append('Consider setting daily screen time limits')
    if user_data['Number_of_Apps_Installed'] > df['Number_of_Apps_Installed'].quantile(0.75):
        recommendations.append('Review and uninstall unused apps to improve battery life')
    if user_data['Battery_Drain'] > df['Battery_Drain'].median():
        recommendations.append('Enable battery saver mode during low usage periods')
    if wellness_score < 50:
        recommendations.append('Take regular breaks every 30 minutes of screen time')
    
    if not recommendations:
        recommendations.append('Great job! Your usage patterns are healthy')
    
    return success_response({
        'wellness_score': round(wellness_score, 1),
        'percentiles': percentiles,
        'recommendations': recommendations,
    })

@app.route('/api/insights/developer', methods=['GET'])
def get_developer_insights():
    """Get insights for app developers"""
    df = load_data()
    
    # User segments analysis
    segments = {}
    for cls in range(1, 6):
        segment_df = df[df['User_Behavior_Class'] == cls]
        if not segment_df.empty:
            segments[cls] = {
                'count': len(segment_df),
                'avg_app_usage': float(segment_df['App_Usage_Time'].mean()),
                'avg_apps_installed': float(segment_df['Number_of_Apps_Installed'].mean()),
                'dominant_os': segment_df['Operating_System'].mode().iloc[0] if len(segment_df) > 0 else 'Unknown',
            }
    
    # Engagement metrics
    engagement = {
        'high_engagement_users': len(df[df['User_Behavior_Class'] >= 4]),
        'moderate_engagement_users': len(df[df['User_Behavior_Class'] == 3]),
        'low_engagement_users': len(df[df['User_Behavior_Class'] <= 2]),
        'avg_daily_app_usage_mins': float(df['App_Usage_Time'].mean()),
    }
    
    # Device optimization priorities
    device_stats = df.groupby('Device_Model').agg({
        'App_Usage_Time': 'mean',
        'User_ID': 'count'
    }).rename(columns={'User_ID': 'user_count'})
    
    device_optimization = {
        device: {
            'user_count': int(stats['user_count']),
            'avg_usage': float(stats['App_Usage_Time']),
        }
        for device, stats in device_stats.iterrows()
    }
    
    return success_response({
        'user_segments': segments,
        'engagement_metrics': engagement,
        'device_optimization': device_optimization,
    })

@app.route('/api/insights/telecom', methods=['GET'])
def get_telecom_insights():
    """Get insights for telecom providers"""
    df = load_data()
    
    # Total data traffic
    total_traffic = float(df['Data_Usage'].sum())
    
    # Segment breakdown
    segment_breakdown = {}
    for cls in range(1, 6):
        segment_df = df[df['User_Behavior_Class'] == cls]
        if not segment_df.empty:
            segment_breakdown[cls] = {
                'user_count': len(segment_df),
                'total_data_mb': float(segment_df['Data_Usage'].sum()),
                'avg_data_mb': float(segment_df['Data_Usage'].mean()),
                'percentage': round(len(segment_df) / len(df) * 100, 1),
            }
    
    # Network load by device
    network_load = df.groupby('Device_Model')['Data_Usage'].sum().to_dict()
    network_load = {k: float(v) for k, v in network_load.items()}
    
    # Pricing recommendations
    recommendations = [
        'Heavy users (Class 5) account for significant data usage - consider premium unlimited plans',
        'Light users (Class 1-2) might benefit from pay-as-you-go options',
        'Android users show higher data consumption - optimize network for Android devices',
    ]
    
    return success_response({
        'total_data_traffic': total_traffic,
        'segment_breakdown': segment_breakdown,
        'network_load': network_load,
        'pricing_recommendations': recommendations,
    })

@app.route('/api/insights/researcher', methods=['GET'])
def get_researcher_insights():
    """Get insights for behavioral researchers"""
    df = load_data()
    
    # Correlation analysis
    numeric_cols = ['App_Usage_Time', 'Screen_On_Time', 'Battery_Drain', 
                    'Number_of_Apps_Installed', 'Data_Usage', 'Age', 'User_Behavior_Class']
    corr_matrix = df[numeric_cols].corr()
    
    correlations = {}
    target = 'User_Behavior_Class'
    for col in numeric_cols:
        if col != target:
            correlations[col] = round(float(corr_matrix.loc[col, target]), 3)
    
    # Statistical summary
    stats_summary = {}
    for col in numeric_cols:
        stats_summary[col] = {
            'mean': float(df[col].mean()),
            'std': float(df[col].std()),
            'min': float(df[col].min()),
            'max': float(df[col].max()),
            'median': float(df[col].median()),
        }
    
    # Behavior profiles
    behavior_profiles = {}
    for cls in range(1, 6):
        segment_df = df[df['User_Behavior_Class'] == cls]
        if not segment_df.empty:
            behavior_profiles[cls] = {
                'avg_screen_time': float(segment_df['Screen_On_Time'].mean()),
                'avg_app_usage': float(segment_df['App_Usage_Time'].mean()),
                'avg_apps': float(segment_df['Number_of_Apps_Installed'].mean()),
                'avg_age': float(segment_df['Age'].mean()),
                'gender_ratio': segment_df['Gender'].value_counts().to_dict(),
            }
    
    return success_response({
        'correlations': correlations,
        'statistical_summary': stats_summary,
        'behavior_profiles': behavior_profiles,
    })

# ============ Health Check ============

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return success_response({
        'status': 'healthy',
        'version': '1.0.0',
    })

# ============ Run Server ============

if __name__ == '__main__':
    # Ensure data directory exists
    (Path(__file__).parent / 'data').mkdir(exist_ok=True)
    (Path(__file__).parent / 'models').mkdir(exist_ok=True)
    
    print("=" * 50)
    print("DeviceIQ Analytics API Server")
    print("=" * 50)
    print(f"Data path: {DATA_PATH}")
    print(f"Server starting on http://localhost:5000")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
