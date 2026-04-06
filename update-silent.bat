@echo off
:: Silent version of update.bat — runs in background via Task Scheduler
cd /d "%~dp0"
python crawl_and_summarize.py > "%~dp0crawl.log" 2>&1
copy /Y merryfair_content_map.json visual-map\public\merryfair_content_map.json >> "%~dp0crawl.log" 2>&1
