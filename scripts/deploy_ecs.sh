#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "[1/5] Installing Docker + Compose plugin"
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg lsb-release
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
  echo "[1/5] Docker already installed, skipping installation"
fi

echo "[2/5] Starting services"
sudo docker compose up -d --build

echo "[3/5] Waiting for backend health"
for i in {1..20}; do
  if curl -fsS http://localhost:4000/health/db >/dev/null; then
    break
  fi
  sleep 3
  if [ "$i" -eq 20 ]; then
    echo "Backend health check failed"
    sudo docker compose logs --tail=100 backend
    exit 1
  fi
done

echo "[4/5] Verifying frontend"
for i in {1..20}; do
  if curl -fsS http://localhost:5173 >/dev/null; then
    break
  fi
  sleep 3
  if [ "$i" -eq 20 ]; then
    echo "Frontend health check failed"
    sudo docker compose logs --tail=100 frontend
    exit 1
  fi
done

echo "[5/5] Deployment done"
