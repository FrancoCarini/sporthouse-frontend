import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Layout from '@/components/Layout'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginator from '../components/Paginator'
import { API_URL, PRODUCTS_PER_PAGE } from '@/config/index'

export default function HomePage({ products }) {
  return (
    <>
    <Layout>
      <h1>Latest Products</h1>
        <Row>
          {products.data.map(product => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
        <Paginator />
      </Layout>
    </>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/products?limit=${PRODUCTS_PER_PAGE}`)
  const products = await res.json()

  return {
    props: { products }
  }
}
