import { Row, Col, Form, Button } from 'react-bootstrap'
import Product from '../components/Product'
import Layout from '@/components/Layout'
import FormContainer from '@/components/FormContainer'
import Paginator from '../components/Paginator'
import { API_URL, PRODUCTS_PER_PAGE } from '@/config/index'

export default function HomePage({ products, page }) {
  return (
    <Layout>
      <h1>Products</h1>
      <FormContainer>
        <h3>Filter</h3>
        <Form>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
              type='email'
              placeholder='Enter Email'
            >
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type='password'
              placeholder='Enter Password'
            >
            </Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary'>Filter</Button>
        </Form>
      </FormContainer>
      <Row>
        {products.data.map(product => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      <Paginator page={page} prevNext={products.pagination} />
    </Layout>
  )
}

export async function getServerSideProps({ query: { page = 1 } }) {
  if (isNaN(page)) {
    page = 1
  }

  const res = await fetch(`${API_URL}/products?page=${page}&limit=${PRODUCTS_PER_PAGE}`)
  const products = await res.json()

  return {
    props: { 
      products,
      page
    }
  }
}
