import Link from 'next/link'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { CLOUDINARY_ROOT, CLOUDINARY_PRODUCTS } from '@/config/index'

export default function Product({ product }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Link href={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>
      <Card.Body>
        <Link href={`/product/${product._id}`}>
          <Card.Title as='div'><strong>{product.brand.name} - {product.name}</strong></Card.Title>
        </Link>
        <Card.Text as='div'>
          <Rating 
            value={product.ratingsAverage || 0} 
            text={`${product.ratingsQuantity} reviews`} 
            color='red'  
          />
        </Card.Text>
        <Card.Text as='h3'>${(product.priceCents/100).toFixed()}</Card.Text>
      </Card.Body>
    </Card>
  )
}
