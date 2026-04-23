# Architecture Diagram & System Design

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            USER BROWSER                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   HTML UI       │  │   JavaScript    │  │   Browser Dev   │                  │
│  │   (index.html)  │  │   (app.js)      │  │   Tools Console │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Request (GET/POST)
                                    │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY (Node.js)                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   HTTP Server   │  │   CORS Handler  │  │   Request Log   │                  │
│  │   (Port 3000)  │  │                 │  │   (gateway.log) │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│         │                     │                     │                          │
│         │ Static Files        │ API Forwarding      │ Logging                   │
│         │ (HTML/JS)           │ to Backend          │                           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Request Forwarding
                                    │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Python Flask)                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Flask App     │  │   Data Store    │  │   Console Log   │                  │
│  │   (Port 5001)   │  │   (In-memory)   │  │                 │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│         │                     │                     │                          │
│         │ REST API            │ Business Logic      │ Request/Response          │
│         │ Endpoints           │ & Data Processing   │ Logging                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Sequence Diagram

```
User → Frontend → Gateway → Backend → Gateway → Frontend → User
  │       │        │         │          │        │         │
  │       │        │         │          │        │         │
  │ 1. Add Data    │         │          │        │         │
  │──────────────►│         │          │        │         │
  │       │ 2. POST /api/data│         │          │        │
  │       │────────────────►│         │          │        │
  │       │        │ 3. Forward POST│         │          │
  │       │        │────────────────►│          │        │
  │       │        │         │ 4. Process & Store│        │
  │       │        │         │────────────────►│        │
  │       │        │         │ 5. Response (201) │        │
  │       │        │         │◄────────────────│        │
  │       │        │ 6. Forward Response│        │
  │       │        │◄────────────────│        │
  │       │ 7. Success Response│        │
  │       │◄────────────────│        │
  │ 8. Update UI │        │
  │◄──────────────│        │
  │       │        │
  │ 9. Auto-refresh (every 5s)        │
  │──────────────►│        │
  │       │ 10. GET /api/data        │
  │       │────────────────►│        │
  │       │        │ 11. Forward GET │
  │       │        │────────────────►│
  │       │        │         │ 12. Return all data│
  │       │        │         │────────────────►│
  │       │        │         │ 13. Response (200)│
  │       │        │         │◄────────────────│
  │       │        │ 14. Forward Response│
  │       │        │◄────────────────│
  │       │ 15. Update List│
  │       │◄────────────────│
  │ 16. Display Updated Data│
  │◄──────────────│
```

## 🎯 Component Responsibilities

### Frontend (Browser)
- **User Interface**: HTML/CSS rendering
- **Client Logic**: JavaScript event handling
- **Auto-refresh**: Timer-based data fetching
- **Status Monitoring**: Connection health checks
- **User Input**: Form validation and submission

### API Gateway (Node.js)
- **Request Routing**: Forward API calls to backend
- **Static Serving**: Serve HTML/JavaScript files
- **CORS Management**: Handle cross-origin requests
- **Logging**: Record all request/response activity
- **Error Handling**: Graceful failure management

### Backend (Python Flask)
- **Business Logic**: Data processing and validation
- **Data Storage**: In-memory data management
- **API Endpoints**: RESTful interface
- **Health Monitoring**: Service availability checks
- **Request Logging**: Debug and audit trails

## 🔧 Technical Specifications

### Communication Protocols
```
Frontend ↔ Gateway: HTTP/1.1
Gateway ↔ Backend: HTTP/1.1
Data Format: JSON
Character Encoding: UTF-8
```

### Service Configuration
```
Frontend/Gateway:
- Port: 3000
- Host: 0.0.0.0
- Protocol: HTTP

Backend:
- Port: 5001
- Host: 0.0.0.0
- Protocol: HTTP
- Debug Mode: Enabled
```

### Data Models
```json
// Data Item
{
  "id": "integer",
  "text": "string",
  "timestamp": "ISO 8601 datetime"
}

// API Response
{
  "data": "[array of data items]",
  "count": "integer"
}

// Health Check
{
  "status": "string",
  "service": "string"
}
```

## 📊 Performance Characteristics

### Response Times (Typical)
- Frontend → Gateway: ~5ms
- Gateway → Backend: ~10ms
- Backend Processing: ~2ms
- Total Round Trip: ~20ms

### Auto-refresh Behavior
- Interval: 5000ms (5 seconds)
- Health Check: 10000ms (10 seconds)
- Timeout Handling: Graceful degradation

### Resource Usage
- Memory: Minimal (in-memory storage)
- CPU: Low (simple operations)
- Network: Local only (localhost)
- Storage: Log files only

## 🛡️ Security Considerations

### Current Implementation
- **CORS**: Enabled for all origins (development)
- **Input Validation**: Basic text validation
- **Error Handling**: Generic error messages
- **Logging**: Request tracking

### Production Recommendations
- **Authentication**: Add user authentication
- **HTTPS**: Enable SSL/TLS
- **Input Sanitization**: Enhanced validation
- **Rate Limiting**: Prevent abuse
- **CORS**: Restrict to specific domains

## 🔍 Monitoring & Debugging

### Log Locations
```
Backend: Console output
Gateway: 
  - Console output
  - gateway/gateway.log file
Frontend: Browser Developer Tools Console
```

### Health Check Endpoints
```
GET /api/health
Response: {"status": "healthy", "service": "backend", "gateway": "healthy"}
```

### Debug Information
- Request timestamps
- IP addresses
- HTTP methods and paths
- Response status codes
- Error messages and stack traces
