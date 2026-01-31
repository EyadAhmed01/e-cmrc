# FreshCart - Modern E-Commerce Platform

A modern, full-featured e-commerce application built with React, Vite, and Tailwind CSS. Features a beautiful glassy dark mode UI with complete shopping functionality and admin panel.

## 🚀 Features

### Customer Features
- **User Authentication** - Secure registration and login system
- **Product Browsing** - Browse products with filtering, search, and pagination
- **Shopping Cart** - Add, remove, and update product quantities
- **Wishlist** - Save favorite products for later
- **Product Details** - Detailed product views with images and specifications
- **Brands & Categories** - Browse products by brand and category
- **Checkout** - Complete order placement with shipping information
- **User Account** - Manage profile and change password

### Admin Features
- **Dashboard** - Overview statistics and recent orders
- **Product Management** - Full CRUD operations for products
- **Order Management** - View and manage all customer orders
- **User Management** - Manage users and toggle admin roles
- **Brand Management** - Add, edit, and delete brands
- **Category Management** - Add, edit, and delete categories

### Design Features
- **Modern Glassy Dark Theme** - Beautiful glassmorphism effects
- **Smooth Animations** - Transitions and hover effects
- **Responsive Design** - Works perfectly on all devices
- **Custom Scrollbar** - Styled scrollbar matching the theme

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Formik & Yup** - Form handling and validation
- **Axios** - HTTP client
- **Flowbite** - UI components
- **Font Awesome** - Icons

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd e-cmrc
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── Components/
│   ├── Account/          # User account management
│   ├── Admin/            # Admin panel components
│   ├── Brands/           # Brand listing
│   ├── Cart/             # Shopping cart
│   ├── Footer/           # Footer component
│   ├── Home/             # Home page
│   ├── Layout/            # Main layout wrapper
│   ├── Login/             # Login page
│   ├── Navbar/            # Navigation bar
│   ├── Notfound/          # 404 page
│   ├── Order/             # Checkout/Order page
│   ├── Products/          # Product listing with filters
│   ├── ProtectedRoute/    # Route protection
│   ├── ProtectedAdminRoute/ # Admin route protection
│   ├── Register/          # Registration page
│   ├── Wishlist/          # Wishlist page
│   └── productDetails/    # Product details page
├── Context/
│   ├── CartContext.jsx    # Cart state management
│   ├── CounterContext.jsx # Counter state
│   ├── UserContext.jsx     # User authentication state
│   └── WishlistContext.jsx # Wishlist state management
├── utils/
│   └── axiosInstance.js   # Axios configuration with interceptors
├── App.jsx                # Main app component with routes
└── main.jsx               # Entry point
```

## 🔐 Authentication

The app uses JWT tokens stored in localStorage. Protected routes require authentication, and admin routes require admin role.

### Getting Admin Access

To get admin access:
1. Register a regular account
2. Log in as an existing admin user
3. Navigate to Admin Panel → Users
4. Find your user and click "Make Admin"

Alternatively, if you have backend access, you can manually set a user's role to `admin` in the database.

## 🎨 Styling

The app uses a custom glassy dark theme with:
- Glassmorphism effects (frosted glass)
- Dark gradient backgrounds
- Accent color: `#00ff88` (green)
- Smooth transitions and animations
- Custom utility classes in `src/index.css`

### Custom CSS Classes

- `.glass` - Light glass effect
- `.glass-strong` - Stronger glass effect
- `.glass-card` - Card with glass effect
- `.btn-primary` - Primary button with gradient
- `.btn-secondary` - Secondary button
- `.input-glass` - Glassy input field
- `.gradient-text` - Gradient text effect
- `.glow` - Glow effect

## 📡 API

The app uses the RouteMisr E-Commerce API:
- Base URL: `https://ecommerce.routemisr.com/api/v1`
- Authentication: Token-based (stored in localStorage as `userToken`)

### Key Endpoints

- `/auth/signup` - User registration
- `/auth/signin` - User login
- `/products` - Get products
- `/cart` - Cart operations
- `/wishlist` - Wishlist operations
- `/orders` - Order management
- `/users` - User management (admin)
- `/brands` - Brand management
- `/categories` - Category management

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Protected Routes

- `/cart` - Requires authentication
- `/wishlist` - Requires authentication
- `/order` - Requires authentication
- `/account` - Requires authentication
- `/products` - Requires authentication
- `/brands` - Requires authentication
- `/admin/*` - Requires admin role

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🎯 Key Features Implementation

### State Management
- Context API for global state (Cart, Wishlist, User)
- Local state for component-specific data

### Form Validation
- Formik for form handling
- Yup for schema validation
- Real-time error messages

### Error Handling
- Try-catch blocks for API calls
- User-friendly error messages
- Loading states for better UX

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using React and modern web technologies.

## 🙏 Acknowledgments

- RouteMisr API for the backend
- Tailwind CSS for styling utilities
- Flowbite for UI components
- Font Awesome for icons

---

**Note**: This project uses the RouteMisr E-Commerce API. Make sure you have a valid API key or access to the API endpoints for full functionality.
