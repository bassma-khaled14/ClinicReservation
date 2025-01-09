# Stage 1: Install Python dependencies
FROM python:3.9-slim as python-build

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Install Node.js dependencies and copy Python dependencies
FROM node:18.12.0

WORKDIR /app

# Copy Python dependencies from the first stage
COPY --from=python-build /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=python-build /usr/local/bin /usr/local/bin

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]