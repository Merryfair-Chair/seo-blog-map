@echo off
cd /d "%~dp0"
echo.
echo Updating Merryfair content map from live site...
python crawl_and_summarize.py
echo.
echo Copying updated data to visual map...
copy /Y merryfair_content_map.json visual-map\public\merryfair_content_map.json
echo.
echo Done! Open Claude Code and run /new-post [url] to register the new post.
pause
