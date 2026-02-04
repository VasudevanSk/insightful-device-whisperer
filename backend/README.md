# DeviceIQ Analytics - Flask Backend

This Flask backend provides REST API endpoints for the DeviceIQ mobile usage analytics dashboard.

## Quick Start

### 1. Setup Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Add Data

Copy the `mobile_usage.csv` file to `backend/data/`:

```bash
mkdir -p data
cp ../public/data/mobile_usage.csv data/
```

### 3. Run the Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Data Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET | Get all users |
| `/api/users/<id>` | GET | Get user by ID |
| `/api/stats` | GET | Get aggregated statistics |

### Analytics Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/devices` | GET | Device distribution |
| `/api/analytics/os` | GET | OS distribution |
| `/api/analytics/behavior` | GET | Behavior class distribution |
| `/api/analytics/demographics` | GET | Age & gender breakdown |

### ML Prediction Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/predict/behavior` | POST | Predict user behavior class |
| `/api/predict/usage` | POST | Predict usage metrics |
| `/api/simulate` | POST | Run what-if simulation |

### Role-Specific Insights
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/insights/individual/<id>` | GET | Personal user insights |
| `/api/insights/developer` | GET | App developer insights |
| `/api/insights/telecom` | GET | Telecom provider insights |
| `/api/insights/researcher` | GET | Behavioral research insights |

## Example Requests

### Predict Behavior Class
```bash
curl -X POST http://localhost:5000/api/predict/behavior \
  -H "Content-Type: application/json" \
  -d '{
    "device_model": "iPhone 12",
    "operating_system": "iOS",
    "app_usage_time": 300,
    "screen_on_time": 5.5,
    "battery_drain": 1500,
    "number_of_apps_installed": 45,
    "data_usage": 1000,
    "age": 30,
    "gender": "Male"
  }'
```

### Run Simulation
```bash
curl -X POST http://localhost:5000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "base_user_id": 1,
    "changes": {
      "apps_installed_delta": 20
    }
  }'
```

## Production Deployment

For production, use Gunicorn:

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Connecting Frontend

Set the API URL in your frontend:

```bash
# In your React app's .env file:
VITE_API_URL=http://localhost:5000
```

Or update `src/config/api.ts` with your production URL.

## Adding Real ML Models

To replace the heuristic predictions with real ML models:

1. Train your models using scikit-learn
2. Save them using joblib:
   ```python
   from joblib import dump
   dump(model, 'models/behavior_classifier.joblib')
   ```
3. Load and use in `app.py`:
   ```python
   from joblib import load
   model = load('models/behavior_classifier.joblib')
   prediction = model.predict(features)
   ```
