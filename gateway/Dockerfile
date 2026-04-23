FROM node:18-slim
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package*.json ./

COPY server-simple.js .

COPY ../frontend ./frontend

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3000


HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1


CMD ["node","server-simple.js"]
