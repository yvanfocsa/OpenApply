@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 ou plus recent est necessaire pour lancer OpenApply.
  echo Telechargement : https://nodejs.org/
  pause
  exit /b 1
)
start "" "http://localhost:4173"
npm start
if errorlevel 1 pause
