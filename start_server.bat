@echo off
echo ==========================================
echo   THEMIS ONLINE JUDGE - Local Server
echo ==========================================
echo.
echo Dang khoi dong server...
echo Mo trinh duyet tai: http://localhost:8080
echo.
cd /d "%~dp0"
start http://localhost:8080
node server.js
pause
