@echo off
echo Fixing React version compatibility issues...
echo.

echo Removing node_modules and package-lock.json...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo.
echo Installing dependencies with React 18...
npm install

echo.
echo Dependencies fixed! You can now run: npm run dev
pause