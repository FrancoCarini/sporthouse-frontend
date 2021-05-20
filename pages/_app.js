import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import '../styles/globals.css'
import './bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  )
}

export default MyApp
