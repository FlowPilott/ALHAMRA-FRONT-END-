#!/bin/bash

# Navigate to the project directory
cd projects/frontend/sywftsync-dashboard-web/

# Pull the latest changes from the main branch
git pull origin main

# Install project dependencies
npm i

# Build the project
npm run build

# Remove the existing deployment directory
rm -r /var/www/html/SwiftSync-Admin/

# Copy the new build to the deployment directory
cp -R build/ /var/www/html/SwiftSync-Admin/

# Restart Nginx to apply changes
service nginx restart

echo "Deployment completed successfully."