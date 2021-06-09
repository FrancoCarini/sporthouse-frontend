import { createContext, useState, useEffect } from 'react'

const CartContext = createContext()

const CartProvider = ({children}) => {
  const [cart, setCart] = useState([])
  const [store, setStore] = useState({})

  useEffect(() => {
    if (localStorage.getItem('cart')) {
      setCart(JSON.parse(localStorage.getItem('cart')))
    }

    if (localStorage.getItem('store')) {
      setStore(JSON.parse(localStorage.getItem('store')))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
    localStorage.setItem('store', JSON.stringify(store))
  }, [cart, store])

  const addToCart = product => {
    const existItem = cart.find(x => x._id === product._id)

    if (existItem) {
      setCart(cart.map(x => x._id === existItem._id ? product : x))
    } else {
      setCart([...cart, product])
    }
  }

  const removeFromCart = product => {
    setCart(cart.filter(x => x._id !== product._id))
  }

  const addStoreToCart = storeObj => {
    setStore(storeObj)
  }

  const emptyCart = () => {
    setCart([])
    setStore({})
  }

  return (
    <CartContext.Provider value={{
      cart, 
      addToCart,
      removeFromCart,
      addStoreToCart,
      store,
      setCart,
      setStore,
      emptyCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export { CartContext, CartProvider}
