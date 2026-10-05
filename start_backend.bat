@echo off
title NextGen Smart ATS - Backend API
echo ========================================================
echo Starting NextGen Smart ATS Backend API on port 8000...
echo ========================================================
cd /d "%~dp0backend"
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
pause
