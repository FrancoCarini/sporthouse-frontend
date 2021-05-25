import { createContext, useState } from 'react'

const CartContext = createContext()

const CartProvider = ({children}) => {
  const [cart, setCart] = useState([])
  const [store, setStore] = useState({})

  const addToCart = product => {
    const existItem = cart.find(x => x._id === product._id)

    if (existItem) {
      setCart(cart.map(x => x._id === existItem._id ? product : x))
    } else {
      setCart([...cart, product])
    }
  }

  const removeFromCart = product => {
    setCart([...cart, product])
  }

  const addStoreToCart = storeObj => {
    setStore(storeObj)
  }

  return (
    <CartContext.Provider value={{
      cart, 
      addToCart,
      removeFromCart,
      addStoreToCart,
      store,
      setCart,
      setStore
    }}>
      {children}
    </CartContext.Provider>
  )
}

export { CartContext, CartProvider}
