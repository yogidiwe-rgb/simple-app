const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const logFile = path.join(__dirname, 'gateway.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - GATEWAY - ${message}\n`;
    console.log(logMessage.trim());
    logStream.write(logMessage);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const BACKEND_URL = 'http://localhost:5001';

app.use((req, res, next) => {
    log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

app.get('/api/data', async (req, res) => {
    try {
        log('Forwarding GET /api/data to backend');
        const response = await axios.get(`${BACKEND_URL}/api/data`);
        res.json(response.data);
    } catch (error) {
        log(`Error forwarding to backend: ${error.message}`);
        res.status(500).json({ error: 'Backend service unavailable' });
    }
});

app.post('/api/data', async (req, res) => {
    try {
        log('Forwarding POST /api/data to backend');
        const response = await axios.post(`${BACKEND_URL}/api/data`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        log(`Error forwarding to backend: ${error.message}`);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Backend service unavailable' });
        }
    }
});

app.get('/api/health', async (req, res) => {
    try {
        log('Forwarding GET /api/health to backend');
        const response = await axios.get(`${BACKEND_URL}/api/health`);
        res.json({ ...response.data, gateway: 'healthy' });
    } catch (error) {
        log(`Error checking backend health: ${error.message}`);
        res.status(500).json({ error: 'Backend service unavailable', gateway: 'healthy' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    log(`API Gateway running on port ${PORT}`);
    log(`Serving frontend from: ${path.join(__dirname, '../frontend')}`);
});
