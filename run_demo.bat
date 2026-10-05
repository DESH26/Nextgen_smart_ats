@echo off
title NextGen Smart ATS - Master Launcher
echo ========================================================
echo Launching NextGen Smart ATS (Backend + Frontend)...
echo ========================================================
start "NextGen Smart ATS Backend" cmd /k "call start_backend.bat"
timeout /t 3 /nobreak >nul
start "NextGen Smart ATS Frontend" cmd /k "call start_frontend.bat"
timeout /t 3 /nobreak >nul
start http://localhost:5173
echo Applications launched! Access UI at http://localhost:5173
pause
