@echo off
echo Starting FinTech Application...

echo.
echo Starting MongoDB (make sure MongoDB is installed and running)
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

timeout /t 3

echo Starting Frontend Development Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo FinTech Application is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Default Credentials:
echo Admin: admin@fintech.com / admin123
echo User: user@test.com / user123
echo.
pause