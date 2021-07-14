import axios from 'axios'
import { useState } from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import Image from 'next/image'

import {API_URL} from '@/config/index'

import Star from '@/components/Star'

const FormReview = ({ product, token }) => {
  const [rating, setRating] = useState(null)
  const [review, setReview] = useState('')
  const [sent, setSent] = useState(false)

  const handleStar = rat => {
    setRating(rat)
  }
  
  const handleSubmit = async e => {
    e.preventDefault()
    
    const res = await axios.post(`${API_URL}/products/${product._id}/reviews`, 
      {
        review,
        rating,
        product: product._id
      },
      { 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (res.status === 201) {
      setSent(true)
    }  
  }

  return (
    <Container className={sent ? 'd-none' : 'mb-5'}>
      <Row>
        <Col xs={12} md={4}>
          <Form onSubmit={handleSubmit}>
            <h4>{product.name}</h4>
            <Card>
              <Image src={product.image} alt={product.name} width={640} height={510}/>
            </Card>
            <Star onSubmitStar={handleStar} disabled={sent} />
            <Form.Group>
              <Form.Label>Comment</Form.Label>
              <Form.Control as="textarea" disabled={sent} onChange={e => setReview(e.target.value)} rows={3} />
            </Form.Group>
            <Button type='submit' variant='success'>Rate!</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default FormReview