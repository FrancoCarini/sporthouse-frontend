import { useContext } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { CartContext } from '@/context/CartContext'
import Message from '../../components/Message'
import { useRouter } from 'next/router'
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'


export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useContext(CartContext)
  const router = useRouter()
  
  const checkoutHandler = () => {
    router.push('/cart/store')
  }

  const selectQuantityHandler = (quantity, product) => {
    product.quantity = quantity
    addToCart(product)
  }

  const removeFromCartHandler = (product) => {
    removeFromCart(product)
  }

  return (
    <Layout title='Cart'>
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        { cart.length === 0 ? <Message>Your cart is empty <Link href="/"><a className="btn btn-link">Go Back</a></Link></Message> : (
          <ListGroup variant='flush'>
            {cart.map(product => (
              <ListGroupItem key={product._id}>
                <Row>
                  <Col md={2}>
                    <Image src={product.image} alt={product.name} fluid rounded></Image>
                  </Col>
                  <Col md={3}>
                  <Link href={`/product/${product.slug}`}><a className="btn btn-link">{product.name}</a></Link>
                  </Col>
                  <Col md={2}>
                    ${(product.price / 100).toFixed(2)}
                  </Col>
                  <Col md={2}>
                    <Form.Control as='select' value={product.quantity} onChange={ e => selectQuantityHandler(e.target.value, product) }>
                    {
                      [...Array(product.stock).keys()].map(x => (
                        <option key={`${product._id}-${x}`} value={x + 1}>{x + 1}</option>
                      ))
                    }
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button type='button' variant='light' onClick={() => removeFromCartHandler(product)}><FaTrash /></Button>
                  </Col>
                </Row>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
				  <ListGroup>
					  <ListGroup.Item>
						  <h2>Subtotal ({cart.reduce((acc, item) => acc + Number(item.quantity), 0)}) items</h2>
							${cart.reduce((acc, item) => acc + item.quantity * item.price / 100, 0).toFixed(2)}
						</ListGroup.Item>
						<ListGroup.Item>
						  <Button type='button' 
								className='btn-block' 
								disabled={cart.length === 0} 
								onClick={checkoutHandler}>
										Proceed to Checkout
								</Button>
						</ListGroup.Item>
					</ListGroup>
        </Card>
      </Col>
    </Row>
    </Layout>
  )
}
