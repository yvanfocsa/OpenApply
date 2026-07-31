@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 ou plus recent est necessaire pour lancer OpenApply.
  echo Installation : https://nodejs.org/
  pause
  exit /b 1
)

node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 20 ? 0 : 1)"
if errorlevel 1 (
  echo La version installee de Node.js est trop ancienne :
  node --version
  echo Installe Node.js 20 ou plus recent : https://nodejs.org/
  pause
  exit /b 1
)

node scripts\start.mjs
if errorlevel 1 pause
