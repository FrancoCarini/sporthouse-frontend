import { useState } from 'react'
import PropTypes from 'prop-types'
import {FaStarHalfAlt, FaStar, FaRegStar} from 'react-icons/fa'

import ReviewModal from '@/components/ReviewModal'

const Rating = ({ value, text, color, product }) => {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <>
      <div className='rating' style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)}>
        <span style={{color}}>
          {
            value >= 1 ? <FaStar /> : 
            value >= 0.5 ? <FaStarHalfAlt /> : <FaRegStar /> 
          }
        </span>
        <span style={{color}}>
          {
            value >= 2 ? <FaStar /> : 
            value >= 1.5 ? <FaStarHalfAlt /> : <FaRegStar /> 
          }   
        </span>
        <span style={{color}}>
          {
            value >= 3 ? <FaStar /> : 
            value >= 2.5 ? <FaStarHalfAlt /> : <FaRegStar /> 
          }
        </span>
        <span style={{color}}>
          {
            value >= 4 ? <FaStar /> : 
            value >= 3.5 ? <FaStarHalfAlt /> : <FaRegStar /> 
          }      
        </span>
        <span style={{color}}>
          {
            value >= 5 ? <FaStar /> : 
            value >= 4.5 ? <FaStarHalfAlt /> : <FaRegStar /> 
          }
        </span>
        <p>{'  '}{text && text}</p>
      </div>
    
      <ReviewModal show={showModal} onClose={() => setShowModal(false)} product={product} />
    </>
  )
}

Rating.defaultProps = {
  color: '#f8e825'
}

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  product: PropTypes.object
}

export default Rating
