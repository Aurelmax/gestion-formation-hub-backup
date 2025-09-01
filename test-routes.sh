#!/bin/bash

# Test du serveur backend
echo "=== Test du serveur backend ==="
echo "Route /api/health:"
curl -s http://localhost:5000/api/health | jq .

echo -e "\n=== Test route rendezvous ==="
echo "Route /api/rendezvous:"
curl -s http://localhost:5000/api/rendezvous | jq .

echo -e "\n=== Test route programmes-formation ==="
echo "Route /api/programmes-formation:"
curl -s http://localhost:5000/api/programmes-formation | jq .

echo -e "\n=== Test route catalogue ==="
echo "Route /api/programmes-formation/catalogue:"
curl -s http://localhost:5000/api/programmes-formation/catalogue | jq .

echo -e "\n=== Test route apprenants ==="
echo "Route /api/apprenants:"
curl -s http://localhost:5000/api/apprenants | jq .
