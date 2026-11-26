@echo off
REM Immora BCS (server edition) for Windows 10/11: double-click to start, then use Chrome, Edge or Firefox.
REM First run needs Python 3.10+ from python.org ("Add python.exe to PATH") and internet once for the packages.
setlocal
cd /d "%~dp0"
set PYTHONUTF8=1
set PORT=5080
set PY=
where py >nul 2>nul && set PY=py -3
if not defined PY (where python >nul 2>nul && set PY=python)
if not defined PY goto nopython
if not exist ".venv\Scripts\python.exe" (
  echo First run: creating a Python environment...
  %PY% -m venv .venv
  if errorlevel 1 goto nopython
)
if not exist ".venv\installed.ok" (
  echo Installing requirements - needs internet once...
  ".venv\Scripts\python.exe" -m pip install -q --upgrade pip
  ".venv\Scripts\python.exe" -m pip install -q -r requirements.txt
  if errorlevel 1 (
    echo.
    echo Could not install the requirements. Check the internet connection and run this file again.
    pause
    exit /b 1
  )
  echo ok> ".venv\installed.ok"
)
echo.
echo Immora BCS is starting on http://localhost:%PORT%  - keep this window open; close it to stop.
start "" cmd /c "timeout /t 4 /nobreak >nul & start "" http://localhost:%PORT%"
".venv\Scripts\python.exe" app.py
pause
exit /b 0

:nopython
echo.
echo Python 3 is needed. Install it from https://www.python.org/downloads/windows/
echo and tick "Add python.exe to PATH" during setup, then run this file again.
echo (Or open Immora-BCS.html directly in Chrome, Edge or Firefox - the offline edition needs no install.)
pause
exit /b 1
