#!/bin/bash

# Export Firebase environment variables from serviceAccountKey.json
export FIREBASE_PROJECT_ID=$(cat config/serviceAccountKey.json | jq -r '.project_id')
export FIREBASE_PRIVATE_KEY=$(cat config/serviceAccountKey.json | jq -r '.private_key')
export FIREBASE_CLIENT_EMAIL=$(cat config/serviceAccountKey.json | jq -r '.client_email')
export FIREBASE_CLIENT_ID=$(cat config/serviceAccountKey.json | jq -r '.client_id')
export FIREBASE_PRIVATE_KEY_ID=$(cat config/serviceAccountKey.json | jq -r '.private_key_id')

# Run the server
node server.js
