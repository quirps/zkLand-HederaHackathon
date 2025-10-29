@echo off
setlocal

echo ============================================
echo         Circuit Environment Cleaner
echo ============================================

set BUILD_DIR=build
set INPUT_FILE=input.json

:: Delete the build directory
if exist "%BUILD_DIR%" (
    echo [→] Deleting %BUILD_DIR% directory...
    rmdir /s /q "%BUILD_DIR%"
    echo [✓] %BUILD_DIR% deleted.
) else (
    echo [i] %BUILD_DIR% directory not found.
)

:: Delete the input.json file
if exist "%INPUT_FILE%" (
    echo [→] Deleting %INPUT_FILE%...
    del /q "%INPUT_FILE%"
    echo [✓] %INPUT_FILE% deleted.
) else (
    echo [i] %INPUT_FILE% directory not found.
)

echo.
echo [✓] Clean-up complete.
echo ============================================
pause