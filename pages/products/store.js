import { API_URL } from '@/config/index'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import styles from '@/styles/Store.module.css'

export default function SingleProductPage() {
  return (
    <Layout title='Products'>
      <Link href="/">
        <a className="btn btn-link">Go Back</a>
      </Link>

      <Row>
      <Col>
        <Card className="my-3 p-3 rounded">
            <Card.Img src="https://res.cloudinary.com/dwxfuglag/image/upload/sporthouse/products/sample-image.jpg" variant="top" />
          <Card.Body>
              <Card.Title as='div'><strong>ESTO TAMPOCO</strong></Card.Title>
            <Card.Text as='div'>
              STORE 1
            </Card.Text>
            <Card.Text as='h3'>NO SE QUE ES ESTO</Card.Text>
          </Card.Body>
          <Button className={styles.custom}>Sign In</Button>
        </Card>
        
        </Col>
        <Col>
        <Card className="my-3 p-3 rounded">
            <Card.Img src="https://res.cloudinary.com/dwxfuglag/image/upload/sporthouse/products/sample-image.jpg" variant="top" />
          <Card.Body>
              <Card.Title as='div'><strong>ESTO TAMPOCO</strong></Card.Title>
            <Card.Text as='div'>
              STORE 1
            </Card.Text>
            <Card.Text as='h3'>NO SE QUE ES ESTO</Card.Text>
          </Card.Body>
        </Card>
        </Col>
        <Col>
        <Card className="my-3 p-3 rounded">
            <Card.Img src="https://res.cloudinary.com/dwxfuglag/image/upload/sporthouse/products/sample-image.jpg" variant="top" />
          <Card.Body>
              <Card.Title as='div'><strong>ESTO TAMPOCO</strong></Card.Title>
            <Card.Text as='div'>
              STORE 1
            </Card.Text>
            <Card.Text as='h3'>NO SE QUE ES ESTO</Card.Text>
          </Card.Body>
        </Card>
        </Col>
        </Row>
    </Layout>
  )
}
