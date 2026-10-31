@echo off
echo ========================================================
echo        Starting MarketMind SaaS Application
echo ========================================================
echo [1/2] Launching Spring Boot 3 Backend on port 8080...
start "MarketMind Backend (Port 8080)" cmd /k "cd backend && mvn spring-boot:run"

echo [2/2] Launching Vite React Frontend on port 5173...
start "MarketMind Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo MarketMind is launching!
echo Backend Swagger API: http://localhost:8080/swagger-ui.html
echo Frontend Dashboard:   http://localhost:5173
echo ========================================================

