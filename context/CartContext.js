import { createContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({children}) => {
  const [cart, setCart] = useState([])

  const addToCart = async product => {
    setCart([...cart, product])
  }

  const removeFromCart = async product => {
    setCart([...cart, product])
  }

  return (
    <CartContext.Provider value={{
      cart, 
      addToCart,
      removeFromCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
