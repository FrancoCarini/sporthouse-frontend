import { useState, Fragment } from 'react'
import { FaStar } from 'react-icons/fa'
import { Row, Col } from 'react-bootstrap'
import styles from '@/styles/Star.module.css'

const Star = ({ onSubmitStar, disabled }) => {
  const [rating, setRating] = useState(null)
  const [hover, setHover] = useState(null)

  const handleClick = (ratingValue) => {
    if (!disabled) {
      setRating(ratingValue)
      onSubmitStar(ratingValue)
    }
  }

  return (
    <Row>
      <Col md={8}>
        {[...Array(5)].map((star,i) => {
          const ratingValue = i + 1
          return (
            <Fragment key={i}>
              <label>
                <input 
                  className={styles.no__display} 
                  type="radio" 
                  name="rating" 
                  value={ratingValue} 
                  onClick={() => handleClick(ratingValue)}
                />
                <FaStar 
                  className={styles.star} 
                  size={40}
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            </Fragment>
          )
        })}
      </Col>
    </Row>
  )
}

export default Star