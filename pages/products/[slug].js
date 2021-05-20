import { API_URL } from '@/config/index'
import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import CartContext from '@/context/CartContext'
import Layout from '@/components/Layout'
import Rating from '@/components/Rating'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import axios from 'axios'
import parseSizesColors from '@/helpers/parseSizesColors'


export default function SingleProductPage({ product }) {
  const { addToCart } = useContext(CartContext)
  const router = useRouter()

  // Ver la opcion de useMemo para la linea de abajo
  const [sizes, setSizes] = useState(parseSizesColors(product.variants))
  const [addButtonDisabled, setAddButtonDisabled] = useState(true)
  const [sizeSelectedValue, setSizeSelectedValue] = useState(-1)
  const [colors, setColors] = useState([])
  const [colorSelectDisabled, setColorSelectDisabled] = useState(true)
  const [colorSelectedValue, setColorSelectedValue] = useState(-1)
  const [stock, setStock] = useState([])
  const [stockSelectDisabled, setStockSelectDisabled] = useState(true)
  const [stockSelectedValue, setStockSelectedValue] = useState(-1)

  const selectSize = e => {
    if (Number(e.target.value) === -1) {
      setSizeSelectedValue(-1)
      setColorSelectedValue(-1)
      setColors([])
      setColorSelectDisabled(true)
      setStockSelectedValue(-1)
      setStock([])
      setStockSelectDisabled(true)
      setAddButtonDisabled(true)
    } else {
      setColors(sizes[e.target.value])
      setSizeSelectedValue(e.target.value)
      setColorSelectDisabled(false)
    }
  }

  const selectColor = e => {
    if (Number(e.target.value) === -1) {
      setColorSelectedValue(-1)
      setStock([])
      setStockSelectedValue(-1)
      setStockSelectDisabled(true)
      setAddButtonDisabled(true)
    } else {
      setColorSelectedValue(e.target.value)
      setStockSelectDisabled(false)
      const colorStock = colors.find(color => e.target.value === color.color)
      const stockAux = []
      for (let i = 1; i <= colorStock.stock; i++ ) {
        stockAux.push(i)
      }
      setStock(stockAux)
    }
  }

  const selectStock = e => {
    if (Number(e.target.value) === -1) {
      setStockSelectedValue(-1)
      setAddButtonDisabled(true)
    } else {
      setStockSelectedValue(e.target.value)
      setAddButtonDisabled(false)
    }
  }

  const buttonAdd = () => {
    addToCart({
      _id: product._id,
      quantity: stockSelectedValue,
      color: colorSelectedValue,
      size: sizeSelectedValue,
      price: product.priceCents,
      image: product.image,
      slug: product.slug,
      name: product.name,
      stock: product.stock
    })
    router.push('/cart')
  }

  return (
    <Layout title='Products'>
      <Link href="/">
        <a className="btn btn-link">Go Back</a>
      </Link>

      <Row>
        <Col md={5}>
          <Image src={product.image} fluid/>
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
            <Rating
              value={product.ratingsAverage || 0} 
              text={`${product.ratingsQuantity} reviews`} 
              color='red' 
            />
            </ListGroup.Item>
            <ListGroup.Item>
              Price: ${(product.priceCents / 100).toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>
                    Price: 
                  </Col>
                  <Col>
                    <strong>${(product.priceCents / 100).toFixed(2)}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    Status: 
                  </Col>
                  <Col>
                    {sizes.hasStock ? 'In Stock' : 'No Stock'}
                  </Col>
                </Row>
              </ListGroup.Item>
              
              {sizes.hasStock && (
                <>
                  <ListGroup.Item>
                    <Row>
                      <Col>Size</Col>
                      <Col>
                        <Form.Control as='select' onChange={selectSize} value={sizeSelectedValue}>
                          <option key='select-size' value={-1}>--SELECT--</option>
                          {
                            Object.keys(sizes).map((k) => {
                              if (k !== 'hasStock') {
                                return <option key={`select-size-${k}`} value={k}>{k}</option>
                              }
                            })
                          }
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>  
                  <ListGroup.Item>
                    <Row>
                      <Col>Color</Col>
                      <Col>
                        <Form.Control as='select' disabled={colorSelectDisabled} value={colorSelectedValue} onChange={selectColor}>
                          <option key='select-color' value={-1}>--SELECT--</option>
                          { 
                            colors.map(color => {
                              return <option key={`select-color-${color.color}`} value={color.color}>{color.color}</option>
                            })
                          }
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>  

                  <ListGroup.Item>
                    <Row>
                      <Col>Stock</Col>
                      <Col>
                        <Form.Control as='select' disabled={stockSelectDisabled} onChange={selectStock} value={stockSelectedValue}>
                          <option key='select-stock' value={-1}>--SELECT--</option>
                          { 
                            stock.map(st => {
                              return <option key={`select-stock-${st}`} value={st}>{st}</option>
                            })
                          }
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>  

                  <ListGroup.Item>
                    <Button className='btn-block' type='button' onClick={buttonAdd} disabled={addButtonDisabled}>ADD TO CART</Button>
                  </ListGroup.Item>
                </>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { slug } = context.query
  const response = await axios.get(`${API_URL}/products/slug/${slug}`);
  
  return {
    props: { product: response.data.product }
  }
}
