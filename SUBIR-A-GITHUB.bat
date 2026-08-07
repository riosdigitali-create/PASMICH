@echo off
chcp 65001 >nul
cd /d "%~dp0"
set LOG=%~dp0resultado-github.txt

echo ============================================================ > "%LOG%"
echo   Rediseno editorial - Michelle Ruiz >> "%LOG%"
echo   %DATE% %TIME% >> "%LOG%"
echo ============================================================ >> "%LOG%"

echo.
echo ============================================================
echo   Subiendo el redisenyo a GitHub (repositorio PASMICH)
echo ============================================================
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo [X] Git no esta instalado. >> "%LOG%"
  echo [X] Git no esta instalado. Descargalo de https://git-scm.com
  pause
  exit /b 1
)

git --version >> "%LOG%" 2>&1

if exist ".git\index.lock" del /f /q ".git\index.lock" >nul 2>&1
if not exist ".git" git init >> "%LOG%" 2>&1

git config --local user.name  "Ismael Rios" >> "%LOG%" 2>&1
git config --local user.email "riosdigitali@gmail.com" >> "%LOG%" 2>&1

echo --- Preparando --- >> "%LOG%"
git add -A >> "%LOG%" 2>&1
git commit -m "Redisenyo editorial: hoja michelle.css, pop-up, fotos nuevas y .nojekyll" >> "%LOG%" 2>&1
git branch -M main >> "%LOG%" 2>&1
git remote remove origin >nul 2>&1
git remote add origin https://github.com/riosdigitali-create/PASMICH.git >> "%LOG%" 2>&1

echo. >> "%LOG%"
echo --- Enviando a GitHub --- >> "%LOG%"
echo.
echo --- Enviando a GitHub ---
echo.
echo Si se abre una ventana pidiendo tu cuenta, entra como riosdigitali-create.
echo.

git push -u origin main --force >> "%LOG%" 2>&1
set CODIGO=%ERRORLEVEL%

echo. >> "%LOG%"
echo CODIGO DE SALIDA: %CODIGO% >> "%LOG%"

if not "%CODIGO%"=="0" (
  echo [X] El envio fallo. Revisa resultado-github.txt >> "%LOG%"
  echo.
  echo [X] El envio fallo. El detalle quedo en resultado-github.txt
  echo.
  pause
  exit /b 1
)

echo LISTO: el redisenyo ya esta en GitHub. >> "%LOG%"
echo.
echo ============================================================
echo   Listo. Ya esta en GitHub.
echo ============================================================
echo.
pause
