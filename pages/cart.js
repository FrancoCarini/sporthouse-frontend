import Link from 'next/link'
import CartContext from '@/context/CartContext'
import Message from '../components/Message'
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem } from 'react-bootstrap'


export default function CartPage() {
  const { cart, addToCart } = useContext(CartContext)

  const selectQuantity = e => {
    console.log('Cambio')
  }

  return (
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
                    <Form.Control as='select' value={product.quantity} onChange={selectQuantity}>
                    {
                      [...Array(product.stock).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))
                    }
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button type='button' variant='light' onClick={() => removeFromCartHandler(item.product)}><i className='fas fa-trash'></i></Button>
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
						  <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
							${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
						</ListGroup.Item>
						<ListGroup.Item>
						  <Button type='button' 
								className='btn-block' 
								disabled={cartItems.length === 0} 
								onClick={checkoutHandler}>
										Proceed to Checkout
								</Button>
						</ListGroup.Item>
					</ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
