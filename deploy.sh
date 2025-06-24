#!/bin/bash

# Table Tennis Database - Manual Deployment Script
echo "Building and deploying TTDB to GitHub Pages..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the project
echo "Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful!"
    
    # Deploy to gh-pages branch
    echo "Deploying to GitHub Pages..."
    npm run deploy
    
    if [ $? -eq 0 ]; then
        echo "Deployment successful! 🎉"
        echo "Your site should be available at: https://[your-username].github.io/ttdb/"
    else
        echo "Deployment failed! ❌"
        exit 1
    fi
else
    echo "Build failed! ❌"
    exit 1
fi
