from flask import Flask, request, jsonify
import logging
from datetime import datetime

app = Flask(__name__)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

data_store = []

@app.route('/api/data', methods=['GET'])
def get_data():
    logger.info("GET /api/data - Fetching all data")
    return jsonify({"data": data_store, "count": len(data_store)})

@app.route('/api/data', methods=['POST'])
def add_data():
    item = request.json
    if not item or 'text' not in item:
        logger.warning("POST /api/data - Invalid request: missing text field")
        return jsonify({"error": "Text field is required"}), 400
    
    new_item = {
        "id": len(data_store) + 1,
        "text": item['text'],
        "timestamp": datetime.now().isoformat()
    }
    data_store.append(new_item)
    logger.info(f"POST /api/data - Added item: {new_item}")
    return jsonify(new_item), 201

@app.route('/api/health', methods=['GET'])
def health_check():
    logger.info("GET /api/health - Health check")
    return jsonify({"status": "healthy", "service": "backend"})

if __name__ == '__main__':
    logger.info("Starting Flask backend on port 5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
