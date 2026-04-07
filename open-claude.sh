#!/bin/bash
cd "$(dirname "$0")"
open -a Terminal .
osascript -e 'tell application "Terminal" to do script "cd /Users/merryfair/seo-blog-map && claude"'
