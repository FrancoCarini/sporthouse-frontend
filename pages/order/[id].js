import axios from 'axios'
import Link from 'next/link'
import { Col, Row, ListGroup, Image, Card, Button } from 'react-bootstrap'

import { API_URL } from '@/config/index'
import { parseCookies } from '@/helpers/index'

import Message from '@/components/Message'
import Layout from '@/components/Layout'
import StoreMap from '@/components/StoreMap'

export default function OrderPage({ order }) {
  return (
    <Layout title='Checkout'>
      <h1>Order {order._id}</h1>
      <Row>
          <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              {order.status === 'confirmed' ? <Message variant='info'>Confirmed Order</Message> : (
                <Message variant='danger'>Cancelled Order</Message>
              )}
              <h2>Store</h2>
              <p>
                <strong>Address:</strong>
                {' '}{order.storeId.address}, {order.storeId.city}
              </p>
              <StoreMap coordinates={order.storeId.location.coordinates} />
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.items.length === 0 ? <Message>Order is empty</Message> : (
                <ListGroup variant='flush'>
                  {order.items.map((item, index) => (
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
                          <Link href={`/product/${item.slug}`}>
                            <a>
                              {item.name}
                            </a>
                          </Link>
                        </Col>
                        <Col md={5}>
                          {item.quantity} x ${(item.priceCents / 100).toFixed(2)} = ${(item.quantity * item.priceCents / 100).toFixed(2)}
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
                    <Col>${(order.totalPriceCents / 100).toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>   
    </Layout>
  )
}

export async function getServerSideProps({ req, query }) {
  const { token } = parseCookies(req)

  if (token === undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/account/login"
      }
    }
  }

  const { id } = query
  const res = await axios.get(`${API_URL}/orders/${id}`, 
    { 
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return {
    props: {
      order: res.data.data
    }
  }
}
