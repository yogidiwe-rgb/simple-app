let refreshInterval;
const API_BASE = '/api';

function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - FRONTEND - ${message}`);
}

async function fetchData() {
    try {
        log('Fetching data from API');
        const response = await fetch(`${API_BASE}/data`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        log(`Received ${data.count} items`);
        updateDataList(data.data);
        updateStatus('online');
        updateLastRefresh();
    } catch (error) {
        log(`Error fetching data: ${error.message}`);
        updateStatus('offline');
        document.getElementById('dataList').innerHTML = '<li>Error loading data</li>';
    }
}

async function addData() {
    const input = document.getElementById('dataInput');
    const text = input.value.trim();
    
    if (!text) {
        log('Attempted to add empty data');
        alert('Please enter some text');
        return;
    }
    
    try {
        log(`Adding data: "${text}"`);
        const response = await fetch(`${API_BASE}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        log(`Successfully added item with ID: ${result.id}`);
        input.value = '';
        fetchData();
    } catch (error) {
        log(`Error adding data: ${error.message}`);
        alert('Error adding data. Please try again.');
    }
}

function updateDataList(data) {
    const listElement = document.getElementById('dataList');
    
    if (!data || data.length === 0) {
        listElement.innerHTML = '<li>No data available</li>';
        return;
    }
    
    listElement.innerHTML = data.map(item => `
        <li class="data-item">
            <div class="id">ID: ${item.id}</div>
            <div class="text">${item.text}</div>
            <div class="timestamp">${new Date(item.timestamp).toLocaleString()}</div>
        </li>
    `).join('');
}

function updateStatus(status) {
    const statusElement = document.getElementById('status');
    if (status === 'online') {
        statusElement.className = 'status online';
        statusElement.textContent = '✓ Connected to server';
    } else {
        statusElement.className = 'status offline';
        statusElement.textContent = '✗ Connection lost';
    }
}

function updateLastRefresh() {
    const now = new Date().toLocaleTimeString();
    document.getElementById('lastUpdate').textContent = now;
}

async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
            updateStatus('online');
        } else {
            updateStatus('offline');
        }
    } catch (error) {
        updateStatus('offline');
    }
}

document.getElementById('dataInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addData();
    }
});

function startAutoRefresh() {
    log('Starting auto-refresh (5 second interval)');
    refreshInterval = setInterval(() => {
        log('Auto-refresh triggered');
        fetchData();
    }, 5000);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        log('Stopped auto-refresh');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    log('Frontend application loaded');
    fetchData();
    startAutoRefresh();
    
    setInterval(checkHealth, 10000);
});

window.addEventListener('beforeunload', function() {
    stopAutoRefresh();
});
