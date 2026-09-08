@echo off
echo ===================================================
echo     Treat Street Management Portal Launcher
echo ===================================================
echo.
echo Opening Treat Street Hub in your default browser...
start "" "%~dp0index.html"
echo.
echo Portal opened successfully!
echo You can now use Purchase, Inventory, Kitchen Ops, Analytics, and Recipe SOPs.
timeout /t 3 >nul
exit
