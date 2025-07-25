#!/bin/bash

CONTAINER_NAME="whatsapp-bot"

echo "🛑 Stopping and removing old container: $CONTAINER_NAME"
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

echo "🧱 Building Docker image..."
docker-compose build

echo "🚀 Starting Docker container in detached mode..."
docker-compose up -d

echo "✅ Done! Use 'docker ps' to check the container status."