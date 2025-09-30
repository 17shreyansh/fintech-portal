# FinTech Web Application

A complete MERN stack fintech application with user portal and admin panel.

## Features

### User Portal
- **Dashboard**: Wallet balance, investment overview, transaction history
- **Investment Plans**: Browse and purchase investment plans across 4 categories
- **Wallet**: Add funds with proof upload, transaction history
- **Withdrawals**: Request withdrawals, track status
- **Support**: Create and track support tickets
- **Settings**: Update profile and change password

### Admin Panel
- **Dashboard**: System overview with analytics
- **User Management**: View users, manage status, detailed user information
- **Plan Management**: Create categories and investment plans
- **Transaction Management**: Approve/reject deposits and withdrawals
- **Support Management**: Handle user support tickets

## Tech Stack

- **Frontend**: React.js with Vite, Ant Design
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based auth with role-based access
- **File Upload**: Multer for payment proof uploads

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fintech-app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

Seed initial data:
```bash
npm run seed
```

Start backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Default Credentials

After running the seed script:

**Admin Account:**
- Email: admin@fintech.com
- Password: admin123

**Test User Account:**
- Email: user@test.com
- Password: user123

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Routes
- `GET /api/user/dashboard` - User dashboard data
- `GET /api/user/profile` - User profile
- `PUT /api/user/profile` - Update profile

### Investment Plans
- `GET /api/plans` - Get all plans and categories
- `POST /api/plans/buy/:planId` - Buy investment plan
- `POST /api/plans/categories` - Create category (Admin)
- `POST /api/plans` - Create plan (Admin)

### Transactions
- `POST /api/transactions/deposit` - Request deposit
- `POST /api/transactions/withdraw` - Request withdrawal
- `GET /api/transactions/history` - User transaction history
- `GET /api/transactions/all` - All transactions (Admin)
- `PUT /api/transactions/:id/status` - Update transaction status (Admin)

### Support
- `POST /api/support` - Create support ticket
- `GET /api/support/my-tickets` - User's tickets
- `GET /api/support/all` - All tickets (Admin)
- `PUT /api/support/:id` - Update ticket (Admin)

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/:id/toggle-status` - Toggle user status
- `GET /api/admin/users/:id` - User details

## Production Deployment

### Backend
1. Set production environment variables
2. Use PM2 for process management
3. Set up reverse proxy with Nginx
4. Enable HTTPS with SSL certificates

### Frontend
1. Build production bundle: `npm run build`
2. Serve static files with Nginx or CDN
3. Configure environment variables for API endpoints

## Security Features

- JWT authentication with expiration
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- File upload restrictions
- CORS configuration

## Database Schema

### User
- Personal information and authentication
- Wallet balance and KYC status
- Role-based permissions

### Investment Plans
- Categorized investment options
- Return percentages and durations
- Active/inactive status

### Transactions
- Deposit, withdrawal, purchase, return tracking
- Status management and proof uploads
- User association and timestamps

### Support Tickets
- User issue tracking
- Admin response system
- Status progression

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.