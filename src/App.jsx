import './App.css'
import { About } from './components/about/About'
import { Home } from './components/home/Home'
import { Products } from './components/products/Products'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components/utils/ScrollToTop'
import { Contact } from './components/contact/Contact'
import { ToastContainer } from 'react-toastify'
import React from 'react'
import { Cart } from './components/cart/Cart'
import { ScrollToTopButton } from './components/utils/ScrollToTopButton'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import PrivateRoute from './components/shared/PrivateRoute'
import { CheckOut } from './components/checkout/Checkout'
import { ProductDetail } from './components/products/ProductDetails'
function App() {

  return (
    <React.Fragment>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/signin' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/products/product' element={<ProductDetail />} />
          <Route path='/' element={<PrivateRoute />}>
            <Route path='/checkout' element={<CheckOut />} />
          </Route>
          <Route path='/' element={<PrivateRoute publicPage />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Login />} />
          </Route>
        </Routes>
      </Router>
      <ScrollToTopButton />
      <ToastContainer />
    </React.Fragment>
  )
}

export default App
