@echo off
title NextGen Smart ATS - Frontend UI
echo ========================================================
echo Starting NextGen Smart ATS Frontend UI on port 5173...
echo ========================================================
set PATH=C:\Users\deshv\.gemini\antigravity\scratch\node_bin\node-v20.18.0-win-x64;%PATH%
cd /d "%~dp0frontend"
npm run dev
pause
