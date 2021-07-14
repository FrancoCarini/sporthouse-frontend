import axios from 'axios'
import { Modal, Button, Card } from 'react-bootstrap'
import { useEffect, useState } from 'react'

import { API_URL } from '@/config/index'

import Loader from '@/components/Loader'
import Rating from '@/components/Rating'

const ReviewModal = ({ show, onClose, product }) => {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(async () => {
    if (show) {
      setLoading(true)
      const res = await axios.get(`${API_URL}/products/${product._id}/reviews`)
      setRatings(res.data.data)
      setLoading(false)
    }
  }, [show])

  const handleCloseModal = () => {
    onClose()
  }

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
      scrollable={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Ratings for {product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? <Loader /> : (
          ratings.length ? (
            ratings.map(rating => (
              <Card>
                <Card.Body>
                  {rating.review}
                  <Rating 
                    value={product.ratingsAverage || 0} 
                    text={`${product.ratingsQuantity} reviews`} 
                    color='red'
                    product={product}
                  />
                </Card.Body>
              </Card>
            ))
          ) : 'No reviews'
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>    
  )
  
}

export default ReviewModal