import Link from 'next/link'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

export default function Product({ product }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Link href={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>
      <Card.Body>
        <Link href={`/products/${product.slug}`}>
          <a>
            <Card.Title as='div'><strong>{product.brand.name} - {product.name}</strong></Card.Title>
          </a>
        </Link>
        <Card.Text as='div'>
          <Rating 
            value={product.ratingsAverage || 0} 
            text={`${product.ratingsQuantity} reviews`} 
            color='red'  
          />
        </Card.Text>
        <Card.Text as='h3'>${(product.priceCents/100).toFixed(2)}</Card.Text>
      </Card.Body>
    </Card>
  )
}
