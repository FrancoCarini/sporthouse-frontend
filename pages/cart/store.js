import { API_URL } from '@/config/index'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { CartContext } from '@/context/CartContext'
import Layout from '@/components/Layout'
import { Row, Col, Card, Button } from 'react-bootstrap'
import styles from '@/styles/Store.module.css'
import axios from 'axios'

export default function StorePage({ stores }) {
  const { addStoreToCart } = useContext(CartContext)
  const router = useRouter()

  const selectStoreHander = store => {
    addStoreToCart(store)
    router.push('/cart/checkout')
  }

  return (
    <Layout title='Store'>
      <Link href="/cart">
        <a className="btn btn-link">Go Back</a>
      </Link>

      <Row>
        {stores.map(store => (
          <Col key={store._id}>
            <Card className="my-3 p-3 rounded">
              <Card.Img src={store.image} variant="top" />
              <Card.Body>
                <Card.Title as='div'><strong>{store.name}</strong></Card.Title>
              </Card.Body>
              <Button className={styles.custom} onClick={() => { selectStoreHander(store) }}>SELECT</Button>
            </Card>
          </Col>
        ))}
      </Row>
    </Layout>
  )
}

export async function getServerSideProps() {
  const response = await axios.get(`${API_URL}/stores`);
  
  return {
    props: { stores: response.data.data }
  }
}
