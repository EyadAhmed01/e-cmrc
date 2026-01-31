import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Brands from './Components/Brands/Brands';
import Products from './Components/Products/Products';
import Cart from './Components/Cart/Cart';
import Notfound from './Components/Notfound/Notfound';
import Home from './Components/Home/Home';
import React from 'react';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import CounterContextProvider from './Context/CounterContext';
import UserContextProvider from './Context/UserContext';
import ProductDetails from './Components/productDetails/productDetails';
import CartContextProvider from './Context/CartContext';
import WishlistContextProvider from './Context/WishlistContext';
import Wishlist from './Components/Wishlist/Wishlist';
import Order from './Components/Order/Order';
import Account from './Components/Account/Account';
import AdminLayout from './Components/Admin/AdminLayout/AdminLayout';
import AdminDashboard from './Components/Admin/AdminDashboard/AdminDashboard';
import AdminProducts from './Components/Admin/AdminProducts/AdminProducts';
import AdminOrders from './Components/Admin/AdminOrders/AdminOrders';
import AdminUsers from './Components/Admin/AdminUsers/AdminUsers';
import AdminBrands from './Components/Admin/AdminBrands/AdminBrands';
import AdminCategories from './Components/Admin/AdminCategories/AdminCategories';
import ProtectedAdminRoute from './Components/ProtectedAdminRoute/ProtectedAdminRoute';

function App() {
  const router = createBrowserRouter([
    {
      path: '/', 
      element: <Layout />,
      children: [
        { index: true, element: <Register /> },
        { path: 'login', element: <Login /> },
        { path: 'brands', element: <ProtectedRoute><Brands /></ProtectedRoute> },
        { path: 'products', element: <ProtectedRoute><Products /></ProtectedRoute> },
        { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
        { path: 'wishlist', element: <ProtectedRoute><Wishlist /></ProtectedRoute> },
        { path: 'order', element: <ProtectedRoute><Order /></ProtectedRoute> },
        { path: 'account', element: <ProtectedRoute><Account /></ProtectedRoute> },
        { path: 'home', element: <Home /> },
        { path: 'productDetails/:pId', element: <ProductDetails /> },
        { path: '*', element: <Notfound /> }
      ]
    },
    {
      path: '/admin',
      element: (
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      ),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'products', element: <AdminProducts /> },
        { path: 'orders', element: <AdminOrders /> },
        { path: 'users', element: <AdminUsers /> },
        { path: 'brands', element: <AdminBrands /> },
        { path: 'categories', element: <AdminCategories /> },
      ]
    }
  ]);

  return (
    <UserContextProvider>
      <CartContextProvider>
        <WishlistContextProvider>
          <CounterContextProvider>
            <RouterProvider router={router} />
          </CounterContextProvider>
        </WishlistContextProvider>
      </CartContextProvider>
    </UserContextProvider>
  )
}

export default App;
