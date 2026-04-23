# Project Structure Overview

## 📁 Directory Tree

```
simple lab Day 1/
│
├── 📄 README.md                 # Main project documentation
├── 📄 ARCHITECTURE.md           # System architecture diagrams
├── 📄 PROJECT_STRUCTURE.md      # This file - structure overview
│
├── 📁 backend/                  # Python Flask Backend Service
│   ├── 🐍 app.py               # Main Flask application
│   └── 📄 requirements.txt     # Python dependencies
│
├── 📁 gateway/                  # Node.js API Gateway
│   ├── 📦 package.json         # Node.js dependencies
│   ├── 🟢 server.js            # Express server (requires npm install)
│   ├── 🟢 server-simple.js     # Simple HTTP server (no dependencies)
│   └── 📝 gateway.log          # Runtime logs (auto-generated)
│
└── 📁 frontend/                 # HTML + JavaScript Frontend
    ├── 🌐 index.html           # Main HTML page
    └── 📜 app.js               # Frontend JavaScript logic
```

## 🎯 File Purposes

### Backend Files

#### `backend/app.py`
- **Purpose**: Main Flask application server
- **Port**: 5001
- **Key Features**:
  - RESTful API endpoints (`/api/data`, `/api/health`)
  - In-memory data storage
  - Request/response logging
  - CORS support via gateway

#### `backend/requirements.txt`
- **Purpose**: Python dependency management
- **Dependencies**:
  - Flask==2.3.3 (Web framework)
  - Werkzeug==2.3.7 (WSGI utilities)

### Gateway Files

#### `gateway/server.js`
- **Purpose**: Express-based API gateway
- **Dependencies**: Requires `npm install`
- **Features**: Full Express functionality with middleware

#### `gateway/server-simple.js`
- **Purpose**: Dependency-free Node.js gateway
- **Advantages**: Works without npm install
- **Features**: Basic HTTP server with request forwarding

#### `gateway/package.json`
- **Purpose**: Node.js project configuration
- **Dependencies**:
  - express (Web framework)
  - cors (Cross-origin resource sharing)
  - axios (HTTP client)

#### `gateway/gateway.log`
- **Purpose**: Runtime request/response logging
- **Format**: Timestamped entries with request details
- **Auto-generated**: Created when gateway starts

### Frontend Files

#### `frontend/index.html`
- **Purpose**: Main user interface
- **Features**:
  - Responsive design
  - Form for data input
  - List display area
  - Status indicators
  - Auto-refresh information

#### `frontend/app.js`
- **Purpose**: Frontend application logic
- **Features**:
  - API communication
  - Auto-refresh timer (5 seconds)
  - Form validation
  - Connection monitoring
  - UI updates

## 🔗 Service Dependencies

```
Frontend (Browser)
    ↓ HTTP requests
Gateway (Node.js)
    ↓ Request forwarding
Backend (Flask)
    ↓ Data processing
In-memory Storage
```

### Communication Flow

1. **User interacts** with `frontend/index.html`
2. **JavaScript** (`app.js`) makes HTTP requests
3. **Gateway** (`server-simple.js`) receives requests
4. **Gateway forwards** to backend service
5. **Backend** (`app.py`) processes requests
6. **Response flows** back through the chain
7. **Frontend updates** UI automatically

## 🚀 Startup Sequence

### Step 1: Backend Service
```bash
cd backend
pip install -r requirements.txt
python app.py
# → Flask server starts on port 5001
```

### Step 2: API Gateway
```bash
cd gateway
node server-simple.js
# → Gateway starts on port 3000
# → Begins serving frontend files
```

### Step 3: Access Application
```
Open browser: http://localhost:3000
→ Loads index.html
→ Connects to gateway
→ Auto-refreshes every 5 seconds
```

## 📊 Data Flow by File

### Request Processing
```
app.js (Frontend)
    ↓ fetch('/api/data')
server-simple.js (Gateway)
    ↓ HTTP request to localhost:5001
app.py (Backend)
    ↓ Flask route handler
    ↓ Data processing
    ↓ JSON response
```

### Static File Serving
```
Browser requests '/'
    ↓
server-simple.js serves '../frontend/index.html'
    ↓
Browser loads HTML and app.js
```

## 🛠️ Development vs Production

### Development Setup (Current)
- **Ports**: 3000 (gateway), 5001 (backend)
- **CORS**: Wide open for development
- **Logging**: Verbose console output
- **Storage**: In-memory (resets on restart)

### Production Considerations
- **HTTPS**: Enable SSL/TLS
- **Database**: Replace in-memory storage
- **Authentication**: Add user management
- **CORS**: Restrict to specific domains
- **Logging**: Structured logging to files
- **Process Management**: PM2/supervisor

## 🔍 Key Configuration Points

### Port Configuration
- **Gateway Port**: `gateway/server-simple.js` line 5
- **Backend Port**: `backend/app.py` line 42
- **Frontend API Base**: `frontend/app.js` line 2

### Auto-refresh Settings
- **Interval**: `frontend/app.js` line 95 (5000ms)
- **Health Check**: `frontend/app.js` line 108 (10000ms)

### Logging Configuration
- **Backend**: `backend/app.py` line 7-8
- **Gateway**: `gateway/server-simple.js` line 8-14
- **Frontend**: `frontend/app.js` line 3-7

## 📝 File Sizes & Complexity

| File | Lines | Purpose | Complexity |
|------|-------|---------|------------|
| `backend/app.py` | ~45 | Flask API server | Low |
| `gateway/server-simple.js` | ~80 | HTTP gateway | Medium |
| `frontend/index.html` | ~120 | UI structure | Low |
| `frontend/app.js` | ~120 | Client logic | Medium |
| `README.md` | ~200 | Documentation | High |

## 🎯 Extension Points

### Easy Modifications
- **Add new API endpoints**: Backend routes
- **Change UI styling**: Frontend CSS
- **Modify refresh rate**: Frontend timer
- **Add logging levels**: All services

### Advanced Extensions
- **Database integration**: Backend data layer
- **User authentication**: Gateway middleware
- **Real-time updates**: WebSocket integration
- **Mobile app**: API reuse
