@echo off
echo Starting Investment Logic Update...

echo.
echo 1. Running database migration...
cd backend
node migrate-investment-plans.js

echo.
echo 2. Reseeding database with new structure...
node seed.js

echo.
echo 3. Starting backend server...
start cmd /k "npm run dev"

echo.
echo 4. Starting frontend server...
cd ../frontend
start cmd /k "npm run dev"

echo.
echo Investment logic update completed!
echo.
echo Changes made:
echo - Admin now sets total maturity amount instead of daily profit
echo - Users see "You Get" amount directly
echo - Database migrated from expectedReturn to totalMaturityAmount
echo - All components updated to reflect new logic
echo.
echo Example: Invest 100, Admin sets 1000 as total maturity amount
echo User will receive exactly 1000 after the investment period
echo.
pause