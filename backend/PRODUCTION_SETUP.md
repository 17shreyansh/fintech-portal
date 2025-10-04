# Production Setup Guide

## Issues Fixed

1. **CORS Configuration**: Added proper CORS settings for production
2. **Error Handling**: Added comprehensive error handling middleware
3. **Database Connection**: Added retry logic for MongoDB connection
4. **Cron Jobs**: Fixed to run daily in production (not every minute)
5. **Graceful Shutdown**: Added proper shutdown handling
6. **Health Check**: Added `/health` endpoint for monitoring
7. **Security**: Added trust proxy for production

## Deployment Steps

### 1. Environment Setup
```bash
# Copy production environment file
cp .env.production .env

# Update the following variables:
MONGODB_URI=mongodb://your-production-db/fintech-app
JWT_SECRET=your-secure-jwt-secret-key
EMAIL_USER=your-production-email@domain.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://yourdomain.com
```

### 2. Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### 3. Start Application
```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Or start directly
npm run start
```

### 4. Monitor Application
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs fintech-backend

# Restart if needed
pm2 restart fintech-backend
```

### 5. Nginx Configuration (Optional)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Health Check
Visit `http://yourdomain.com/health` to verify the server is running.

## Common Issues

1. **Port already in use**: Change PORT in .env
2. **MongoDB connection failed**: Check MONGODB_URI
3. **CORS errors**: Verify FRONTEND_URL in .env
4. **Email not working**: Check EMAIL_USER and EMAIL_PASS