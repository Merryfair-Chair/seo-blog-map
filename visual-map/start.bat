@echo off
cd /d "%~dp0"
echo Building latest version...
call npm run build
echo.
echo Starting Merryfair Visual Map...
start http://localhost:3737
node server.js
pause
