@echo off
:: Creates a Windows Task Scheduler job that re-crawls the site every day at 8am
:: Run this file ONCE to set it up. After that it runs automatically.

set TASK_NAME=MerryfairDailyCrawl
set SCRIPT_PATH=%~dp0update-silent.bat
set PYTHON_PATH=python

echo Creating scheduled task: %TASK_NAME%
schtasks /create /f /tn "%TASK_NAME%" /tr "\"%SCRIPT_PATH%\"" /sc daily /st 08:00 /ru "%USERNAME%"

echo.
echo Done. The crawl will now run automatically every day at 8:00 AM.
echo To remove it: schtasks /delete /tn "%TASK_NAME%" /f
pause
