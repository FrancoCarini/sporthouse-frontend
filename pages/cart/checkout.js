import {API_URL} from '@/config/index'
import { useContext, useState } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { CartContext } from '@/context/CartContext'
import { useRouter } from 'next/router'
import Message from '../../components/Message'
import { Col, Row, ListGroup, Image, Card, Button } from 'react-bootstrap'
import {parseCookies} from '@/helpers/index'
import axios from 'axios'

export default function CheckoutPage({ token }) {
  const { cart, store, setCart, setStore, emptyCart } = useContext(CartContext)
  const router = useRouter()
  const [error, setError] = useState(false)

  const createOrderHandler = async () => {
    const orderToCreate = {}
    orderToCreate.storeId = store._id
    orderToCreate.items = cart.map(item => {
      return {
        product: item._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      }
    })

    const  res = await axios.post(`${API_URL}/orders`, 
      orderToCreate,
      { 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (res.status === 201) {
      emptyCart()
      return router.push(`/order/${res.data.data._id}`)
    }

    setError(true)
    setTimeout(() => {
      setError(false)
    }, 4000);
  }

  return (
    <Layout title='Checkout'>
      {error && <Message variant='danger'>There was an error creating the order. Please Try Again</Message>}
      <Row>
        <Col md={8}>
        <ListGroup variant='flush'>
          <ListGroup.Item>
            <h2>Store</h2>
            <p>
              <strong>Address:</strong>
              {' '}{store.address}, {store.city},{' '}
            </p>
          </ListGroup.Item>
          <ListGroup.Item>
            <h2>Order Items</h2>
            {cart.length === 0 ? <Message>Your cart is empty</Message> : (
              <ListGroup variant='flush'>
                {cart.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col>
                        <Link href={`/products/${item.slug}`}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={5}>
                        {item.quantity} x ${(item.price / 100).toFixed(2) } = ${(item.quantity * item.price / 100).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.reduce((acc, item) => acc + item.price * item.quantity, 0) / 100}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button 
                  type='button' 
                  className='btn-block' 
                  disabled={cart.length === 0}
                  onClick={createOrderHandler}
                >Place Order</Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>   
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req)
  const user = JSON.parse(cookies.user)

  if (typeof user.token === 'undefined') {
    return {
      redirect: {
        permanent: false,
        destination: "/account/login"
      }
    }
  }

  return {
    props: {
      token: user.token
    }
  }
}
