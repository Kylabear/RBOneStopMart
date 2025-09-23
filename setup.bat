@echo off
echo 🚀 Setting up R&B One Stop Mart E-commerce Platform
echo ==================================================

REM Check if composer is installed
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Composer is not installed. Please install Composer first.
    pause
    exit /b 1
)

REM Check if node is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install PHP dependencies
echo 📦 Installing PHP dependencies...
composer install

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
npm install

REM Copy environment file
echo ⚙️ Setting up environment...
if not exist .env (
    copy .env.example .env
    echo ✅ Environment file created
) else (
    echo ⚠️ Environment file already exists
)

REM Generate application key
echo 🔑 Generating application key...
php artisan key:generate

REM Create database
echo 🗄️ Setting up database...
echo Please make sure MySQL is running and create a database named 'rb_onestopmart'
echo You can do this by running: CREATE DATABASE rb_onestopmart;
pause

REM Run migrations
echo 📊 Running database migrations...
php artisan migrate

REM Run seeders
echo 🌱 Seeding database with sample data...
php artisan db:seed

REM Build frontend assets
echo 🎨 Building frontend assets...
npm run build

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Update your .env file with correct database credentials
echo 2. Start the development server: php artisan serve
echo 3. Open your browser and visit: http://localhost:8000
echo.
echo 👤 Default admin credentials:
echo Email: admin@rbonestopmart.com
echo Password: password
echo.
echo 👤 Default customer credentials:
echo Email: customer@example.com
echo Password: password
echo.
echo 📞 Contact Information:
echo Phone: 09123968514
echo Email: R&BOneStopMart@gmail.com
echo WhatsApp: +639686654565
echo Facebook: Brenda Bangachon
echo.
echo Happy coding! 🚀
pause
