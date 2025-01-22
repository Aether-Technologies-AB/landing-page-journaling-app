#!/bin/bash

# Install Firebase Admin SDK
npm install firebase-admin

# Create a directory for service account key if it doesn't exist
mkdir -p config

echo "Please follow these steps to set up Firebase Admin SDK:"
echo "1. Go to Firebase Console -> Project Settings -> Service Accounts"
echo "2. Click 'Generate New Private Key'"
echo "3. Save the downloaded JSON file as 'serviceAccountKey.json' in the 'config' directory"
echo "4. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable:"
echo "   export GOOGLE_APPLICATION_CREDENTIALS=\"$(pwd)/config/serviceAccountKey.json\""
