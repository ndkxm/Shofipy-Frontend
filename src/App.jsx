import './App.css'
import { About } from './components/about/About'
import { Home } from './components/home/Home'
import { Products } from './components/products/Products'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components/utils/ScrollToTop'
import { Contact } from './components/contact/Contact'
import { ToastContainer } from 'react-toastify'
import React, { useEffect } from 'react'
import { Cart } from './components/cart/Cart'
import { ScrollToTopButton } from './components/utils/ScrollToTopButton'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import ResetPassword from './components/auth/ResetPassword'
import { ForgotPassword } from './components/auth/ForgotPassword'
import PrivateRoute from './components/shared/PrivateRoute'
import { CheckOut } from './components/checkout/Checkout'
import { ProductDetail } from './components/products/ProductDetails'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserCart, renewAccessToken } from './store/actions/index'
import { UserProfile } from './components/profile/UserProfile'
import { MyOrder } from './components/orders/MyOrder'
import { StaffDashboard } from './components/staff/StaffDashboard'
import { FAQ } from './components/info/FAQ'
import { Returns } from './components/info/Returns'
import { Policy } from './components/info/Policy'
import { PageCurtain } from './components/shared/PageCurtain'
import { MotionConfig } from 'framer-motion'
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    if(user)
    dispatch(renewAccessToken());
  }, [])

  useEffect(() => {
    if (user) {
      dispatch(fetchUserCart());
    }
  }, [user, dispatch]);

  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <ScrollToTop />
        <PageCurtain />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/returns' element={<Returns />} />
          <Route path='/policy' element={<Policy />} />
          <Route path='/products/product/:id' element={<ProductDetail />} />
          <Route path='/' element={<PrivateRoute adminOnly />}>
            <Route path='/admin' element={<AdminDashboard />} />
          </Route>
          <Route path='/' element={<PrivateRoute staffOnly />}>
            <Route path='/staff' element={<StaffDashboard />} />
          </Route>
          <Route path='/' element={<PrivateRoute />}>
            <Route path='/checkout' element={<CheckOut />} />
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/my-orders' element={<MyOrder />} />
          </Route>
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/' element={<PrivateRoute publicPage />}>
            <Route path='/signin' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
        </Routes>
      </Router>
      <ScrollToTopButton />
      <ToastContainer />
    </MotionConfig>
  )
}

export default App
