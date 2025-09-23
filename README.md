# R&B One Stop Mart - E-commerce Platform

A modern, full-stack e-commerce platform built with Laravel, React, and MySQL, featuring glassmorphism design and comprehensive business management capabilities.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse products across three categories (Grocery, Dry Goods, Farm Supply)
- **Smart Shopping Cart**: Unified cart with category-specific delivery restrictions
- **Flexible Checkout**: Choose between delivery and pickup options
- **Multiple Payment Methods**: COD, GCash, and PayMaya support
- **Order Tracking**: Real-time order status updates
- **Responsive Design**: Optimized for all devices with glassmorphism UI

### Admin Features
- **Dashboard Analytics**: Comprehensive business metrics and insights
- **Inventory Management**: Real-time stock monitoring and alerts
- **Order Management**: Process and track customer orders
- **Product Management**: Add, edit, and manage product catalog
- **User Management**: Customer account administration
- **Print Functionality**: Generate receipts and order lists

### Business Logic
- **Category Restrictions**: Dry Goods items are pickup-only
- **Delivery Options**: Grocery and Farm Supply items support delivery
- **Stock Management**: Automatic inventory tracking and low-stock alerts
- **Order Processing**: Streamlined workflow from order to fulfillment

## 🛠️ Technology Stack

### Backend
- **Laravel 10**: PHP framework with API-first architecture
- **MySQL**: Relational database for data persistence
- **Laravel Sanctum**: API authentication and token management
- **Laravel Breeze**: Authentication scaffolding

### Frontend
- **React 18**: Modern JavaScript library with hooks
- **React Router**: Client-side routing
- **React Query**: Server state management and caching
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful SVG icons
- **Framer Motion**: Smooth animations

### Design System
- **Glassmorphism**: Modern glass-like UI elements
- **Responsive Design**: Mobile-first approach
- **Gradient Backgrounds**: Beautiful color transitions
- **Custom Animations**: Smooth transitions and hover effects

## 📦 Installation

### Prerequisites
- PHP 8.1 or higher
- Composer
- Node.js 16+ and npm
- MySQL 8.0+
- XAMPP (recommended for local development)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RBOneStopMart
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database configuration**
   - Create a MySQL database named `rb_onestopmart`
   - Update `.env` file with database credentials:
     ```
     DB_DATABASE=rb_onestopmart
     DB_USERNAME=root
     DB_PASSWORD=
     ```

6. **Run migrations and seeders**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Build frontend assets**
   ```bash
   npm run build
   # or for development
   npm run dev
   ```

8. **Start the development server**
   ```bash
   php artisan serve
   ```

## 🗄️ Database Schema

### Core Tables
- **users**: Customer and admin accounts
- **categories**: Product categories (Grocery, Dry Goods, Farm Supply)
- **products**: Product catalog with inventory tracking
- **orders**: Customer orders with delivery/pickup options
- **order_items**: Individual items within orders
- **cart_items**: Shopping cart functionality

### Key Relationships
- Users have many orders
- Categories have many products
- Orders have many order items
- Products belong to categories
- Cart items link users to products

## 🎨 Design Features

### Glassmorphism Elements
- **Glass Cards**: Semi-transparent cards with backdrop blur
- **Glass Buttons**: Interactive elements with hover effects
- **Glass Navigation**: Sticky header with blur effects
- **Glass Forms**: Input fields with glass-like appearance

### Responsive Layout
- **Mobile-First**: Optimized for mobile devices
- **Flexible Grid**: Adaptive layouts for all screen sizes
- **Touch-Friendly**: Large touch targets for mobile users
- **Progressive Enhancement**: Works on all devices

## 🔐 Authentication & Authorization

### User Roles
- **Customer**: Can browse, shop, and place orders
- **Admin**: Full access to management features

### Security Features
- **API Token Authentication**: Secure API access
- **Role-Based Access Control**: Admin-only routes
- **CSRF Protection**: Cross-site request forgery prevention
- **Input Validation**: Server-side data validation

## 📱 API Endpoints

### Public Endpoints
- `GET /api/products` - List products
- `GET /api/categories` - List categories
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Protected Endpoints
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `GET /api/orders` - User orders
- `POST /api/orders` - Create order

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `GET /api/admin/products` - Product management
- `PUT /api/admin/orders/{id}/status` - Update order status

## 🚀 Deployment

### Production Setup
1. **Server Requirements**
   - PHP 8.1+
   - MySQL 8.0+
   - Node.js 16+
   - Web server (Apache/Nginx)

2. **Environment Configuration**
   - Set `APP_ENV=production`
   - Configure database credentials
   - Set up SSL certificates
   - Configure file storage

3. **Asset Compilation**
   ```bash
   npm run build
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

## 📞 Contact Information

**R&B One Stop Mart**
- **Phone**: 09123968514
- **Email**: R&BOneStopMart@gmail.com
- **WhatsApp**: +639686654565
- **Facebook**: Brenda Bangachon

## 🎯 Business Categories

### Grocery
- Fresh produce and daily essentials
- Supports both delivery and pickup
- Real-time inventory tracking

### Dry Goods
- Non-perishable items
- **Pickup only** - no delivery option
- Bulk quantities available

### Farm Supply
- Agricultural equipment and supplies
- Supports both delivery and pickup
- Specialized farming products

## 🔄 Order Workflow

1. **Customer Places Order**
   - Selects delivery method
   - Chooses payment option
   - Provides contact information

2. **Admin Notification**
   - Real-time order alerts
   - Order details and customer info
   - Inventory updates

3. **Order Processing**
   - Status updates (pending → confirmed → preparing → ready)
   - Delivery/pickup coordination
   - Customer notifications

4. **Fulfillment**
   - Order preparation
   - Quality control
   - Delivery or pickup completion

## 🛡️ Security Considerations

- **Data Encryption**: Sensitive data protection
- **Input Sanitization**: XSS prevention
- **SQL Injection Protection**: Parameterized queries
- **Rate Limiting**: API abuse prevention
- **Secure Headers**: Security headers implementation

## 📈 Performance Optimization

- **Database Indexing**: Optimized query performance
- **Asset Minification**: Reduced file sizes
- **Caching Strategy**: Improved response times
- **Image Optimization**: Compressed product images
- **Lazy Loading**: On-demand content loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Laravel community for the excellent framework
- React team for the powerful UI library
- Tailwind CSS for the utility-first approach
- All contributors and supporters

---

**Built with ❤️ for R&B One Stop Mart**