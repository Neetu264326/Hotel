import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import ChatAssistant from './components/ChatAssistant'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'

const Home = lazy(() => import('./pages/Home'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const Restaurants = lazy(() => import('./pages/Restaurants'))
const RestaurantDetails = lazy(() => import('./pages/RestaurantDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Payment = lazy(() => import('./pages/Payment'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const TrackOrder = lazy(() => import('./pages/TrackOrder'))
const Offers = lazy(() => import('./pages/Offers'))
const About = lazy(() => import('./pages/About'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

const pageMeta = {
  '/': { title: 'Delishful - Good Food. Delivered Fast.', desc: 'Discover delicious meals from your favorite restaurants and get them delivered to your doorstep, fast.' },
  '/restaurants': { title: 'Restaurants Near You | Delishful', desc: 'Explore restaurants by cuisine, rating, price and delivery time. Find the best food near you.' },
  '/cart': { title: 'Your Cart | Delishful', desc: 'Review items in your cart and proceed to checkout.' },
  '/checkout': { title: 'Checkout | Delishful', desc: 'Enter your address, choose delivery options and review your order.' },
  '/payment': { title: 'Payment | Delishful', desc: 'Pay securely with Cash on Delivery, UPI, Card, Net Banking or Wallet.' },
  '/order-success': { title: 'Order Confirmed | Delishful', desc: 'Your order has been placed successfully. Track it in real-time.' },
  '/track-order': { title: 'Track Your Order | Delishful', desc: 'Follow your food from the restaurant to your doorstep.' },
  '/offers': { title: 'Offers & Coupons | Delishful', desc: 'Save more with exclusive coupons and restaurant offers.' },
  '/about': { title: 'About Us | Delishful', desc: 'We connect you with the best restaurants and deliver happiness one meal at a time.' },
  '/login': { title: 'Login | Delishful', desc: 'Login to your Delishful account to place orders and track them.' },
  '/register': { title: 'Create Account | Delishful', desc: 'Create a Delishful account to start ordering delicious food.' },
}

function usePageMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const meta = pageMeta[pathname] || pageMeta['/']
    if (meta) {
      document.title = meta.title
      const existing = document.querySelector('meta[name="description"]')
      if (existing) existing.setAttribute('content', meta.desc)
    }
  }, [pathname])
}

function ScrollReset() {
  const { pathname } = useLocation()
  usePageMeta()
  const shouldReset = !['/track-order', '/order-success'].includes(pathname)
  if (shouldReset) {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  return null
}

function AppContent() {
  return (
    <>
      <ScrollReset />
      <Navbar />
      <Suspense fallback={
        <div style={{ minHeight: '70vh' }}>
          <LoadingSpinner label="Loading Delishful..." />
        </div>
      }>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
      <Footer />
      <ChatAssistant />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <AppContent />
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  )
}

export default App
