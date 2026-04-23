# Simple Full Stack Application

A clean, minimal full-stack application demonstrating a three-tier architecture with frontend, API gateway, and backend services.

## 🏗️ Project Structure

```
simple lab Day 1/
├── backend/                 # Python Flask Backend Service
│   ├── app.py              # Main Flask application
│   └── requirements.txt    # Python dependencies
├── gateway/                # Node.js API Gateway
│   ├── package.json        # Node.js dependencies
│   ├── server.js           # Express server (with dependencies)
│   └── server-simple.js   # Simple HTTP server (no dependencies)
└── frontend/               # HTML + JavaScript Frontend
    ├── index.html          # Main HTML page
    └── app.js              # Frontend JavaScript logic
```

## 🚀 Architecture Overview

```
┌─────────────────┐    HTTP Request     ┌─────────────────┐    HTTP Request     ┌─────────────────┐
│                 │                    │                 │                    │                 │
│   Frontend      │ ──────────────────►│   API Gateway   │ ──────────────────►│   Backend       │
│   (Browser)     │                    │   (Node.js)     │                    │   (Flask)       │
│   Port 3000     │◄───────────────────│   Port 3000     │◄───────────────────│   Port 5001     │
│                 │    HTTP Response   │                 │    HTTP Response   │                 │
└─────────────────┘                    └─────────────────┘                    └─────────────────┘
```

## 📋 Components

### Backend (Python Flask)
- **Port**: 5001
- **Technology**: Flask 2.3.3
- **Purpose**: Data storage and business logic
- **Features**:
  - RESTful API endpoints
  - In-memory data storage
  - Request/response logging
  - Health check endpoint

### API Gateway (Node.js)
- **Port**: 3000
- **Technology**: Node.js HTTP module
- **Purpose**: Request routing and frontend serving
- **Features**:
  - CORS handling
  - Request forwarding to backend
  - Static file serving
  - Comprehensive logging
  - Health monitoring

### Frontend (HTML + JavaScript)
- **Technology**: Vanilla HTML/CSS/JavaScript
- **Purpose**: User interface and client-side logic
- **Features**:
  - Responsive design
  - Real-time data display
  - Auto-refresh every 5 seconds
  - Connection status monitoring
  - Form validation

## 🔗 API Endpoints

### Backend Endpoints (Port 5001)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/data` | Retrieve all data | `{"data": [...], "count": N}` |
| POST | `/api/data` | Add new data item | `{"id": N, "text": "...", "timestamp": "..."}` |
| GET | `/api/health` | Health check | `{"status": "healthy", "service": "backend"}` |

### Gateway Routes (Port 3000)

| Method | Route | Action |
|--------|-------|--------|
| GET | `/` | Serve frontend HTML |
| GET | `/app.js` | Serve frontend JavaScript |
| GET/POST | `/api/*` | Forward to backend service |
| GET | `/api/health` | Health check with gateway status |

## 📊 Data Flow

```
1. User Action (Browser)
   ↓
2. HTTP Request → API Gateway (Port 3000)
   ↓
3. Request Logging & CORS Handling
   ↓
4. Forward Request → Backend (Port 5001)
   ↓
5. Business Logic & Data Processing
   ↓
6. HTTP Response → API Gateway
   ↓
7. Response Logging & Formatting
   ↓
8. HTTP Response → Browser
   ↓
9. UI Update (Auto-refresh every 5s)
```

## 🗄️ Data Model

```json
{
  "id": 1,
  "text": "Sample text data",
  "timestamp": "2026-04-23T10:30:00.000Z"
}
```

## 📝 Logging

All services implement comprehensive logging:

### Backend Logging
- **Format**: `%(asctime)s - %(name)s - %(levelname)s - %(message)s`
- **Output**: Console
- **Events**: API calls, data operations, errors

### Gateway Logging
- **Format**: `timestamp - GATEWAY - message`
- **Output**: Console + `gateway.log` file
- **Events**: Request routing, errors, service status

### Frontend Logging
- **Format**: `timestamp - FRONTEND - message`
- **Output**: Browser console
- **Events**: User actions, API calls, auto-refresh

## 🛠️ Running the Application

### Prerequisites
- Python 3.7+
- Node.js 14+
- Modern web browser

### Start Services

1. **Backend** (Terminal 1):
```bash
cd backend
pip install -r requirements.txt
python app.py
```

2. **API Gateway** (Terminal 2):
```bash
cd gateway
node server-simple.js
```

3. **Access Application**:
   - Open browser to `http://localhost:3000`

## 🔧 Configuration

### Ports
- Frontend/Gateway: 3000
- Backend: 5001

### Auto-refresh
- Interval: 5 seconds
- Health check: 10 seconds

## 🎯 Features

- ✅ Add data with timestamp
- ✅ Display data list with ID and timestamp
- ✅ Auto-refresh every 5 seconds
- ✅ Real-time connection status
- ✅ Comprehensive logging
- ✅ Health monitoring
- ✅ CORS support
- ✅ Responsive design
- ✅ Error handling
- ✅ Input validation

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change port in `app.py` or `server-simple.js`

2. **CORS Errors**
   - Ensure API Gateway is running
   - Check browser console for errors

3. **Backend Connection Failed**
   - Verify Flask service is running on port 5001
   - Check gateway logs for forwarding errors

4. **Auto-refresh Not Working**
   - Check browser console for JavaScript errors
   - Verify API endpoints are accessible

### Log Locations
- Backend: Terminal console
- Gateway: `gateway/gateway.log` + console
- Frontend: Browser developer tools console
