#!/bin/bash
# ============================================================
#  Double-click this file to launch SiteWell Studio.
#  It starts the local server and opens the site in your browser.
#  Keep the window that opens open while you work; closing it
#  stops the server.
# ============================================================

cd "$(dirname "$0")" || exit 1

# If a previous server is still holding our port, stop it first.
lsof -ti tcp:4787 | xargs kill -9 2>/dev/null

# Open the browser once the server has had a moment to start.
( sleep 1.5; open "http://localhost:4787/index.html" ) &

echo "SiteWell Studio is starting..."
echo "Opening http://localhost:4787/ in your browser."
echo ""
echo "To edit a client's templates, click \"Studio\" in the footer,"
echo "or go to  http://localhost:4787/studio/customize.html"
echo ""
echo "Keep this window open while you work. Close it to stop the server."
echo "------------------------------------------------------------"

python3 server.py
