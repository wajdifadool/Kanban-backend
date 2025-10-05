#!/bin/bash

echo "📁 Creating project directory..."
mkdir -p backend_project
cd backend_project || exit 1

echo "📦 Initializing npm..."
npm init -y

echo "📦 Installing dependencies..."
npm install express dotenv mongoose morgan cookie-parser express-fileupload slugify qs

echo "📦 Installing dev dependencies..."
npm install --save-dev nodemon colors

echo "📁 Unzipping project template files..."
unzip ../backend_template.zip -d .

echo "✅ Backend project setup complete!"
echo "To start developing:"
echo "1. Update config/config.env with your Mongo URI if needed."
echo "2. Run using: npx nodemon server.js"
