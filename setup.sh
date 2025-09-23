#!/bin/bash

echo "🚀 Setting up R&B One Stop Mart E-commerce Platform"
echo "=================================================="

# Check if composer is installed
if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed. Please install Composer first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Copy environment file
echo "⚙️ Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Environment file created"
else
    echo "⚠️ Environment file already exists"
fi

# Generate application key
echo "🔑 Generating application key..."
php artisan key:generate

# Create database
echo "🗄️ Setting up database..."
echo "Please make sure MySQL is running and create a database named 'rb_onestopmart'"
echo "You can do this by running: CREATE DATABASE rb_onestopmart;"
read -p "Press Enter when you have created the database..."

# Run migrations
echo "📊 Running database migrations..."
php artisan migrate

# Run seeders
echo "🌱 Seeding database with sample data..."
php artisan db:seed

# Build frontend assets
echo "🎨 Building frontend assets..."
npm run build

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env file with correct database credentials"
echo "2. Start the development server: php artisan serve"
echo "3. Open your browser and visit: http://localhost:8000"
echo ""
echo "👤 Default admin credentials:"
echo "Email: admin@rbonestopmart.com"
echo "Password: password"
echo ""
echo "👤 Default customer credentials:"
echo "Email: customer@example.com"
echo "Password: password"
echo ""
echo "📞 Contact Information:"
echo "Phone: 09123968514"
echo "Email: R&BOneStopMart@gmail.com"
echo "WhatsApp: +639686654565"
echo "Facebook: Brenda Bangachon"
echo ""
echo "Happy coding! 🚀"
