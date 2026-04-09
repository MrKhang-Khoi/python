@echo off
title Gemma 4 AI Chat - Local
color 0A
echo.
echo  ================================================
echo    GEMMA 4 - AI CHAT LOCAL
echo    Mien phi - Rieng tu - Khong can Internet
echo  ================================================
echo.

:: Check if Ollama is running
echo [1/3] Kiem tra Ollama...
curl -s http://localhost:11434 >nul 2>&1
if %errorlevel% neq 0 (
    echo      Khoi dong Ollama...
    start "" ollama serve
    timeout /t 3 /nobreak >nul
) else (
    echo      Ollama dang chay OK
)

:: Set CORS for network access
set OLLAMA_ORIGINS=*

:: Get local IP for sharing
echo.
echo [2/3] Thong tin chia se:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set LOCAL_IP=%%a
)
echo      IP may nay:%LOCAL_IP%
echo.

:: Start web server  
echo [3/3] Khoi dong web server...
echo.
echo  ================================================
echo    TRUY CAP: http://localhost:9090
echo    CHIA SE:  http://%LOCAL_IP: =%:9090
echo  ================================================
echo.
echo  Nhan Ctrl+C de dung server
echo.

py -m http.server 9090 --directory "%~dp0gemma-chat" --bind 0.0.0.0
pause
