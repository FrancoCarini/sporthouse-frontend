import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { useState, Fragment } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useRouter } from 'next/router'

import { API_URL } from '@/config/index'

import VariantsForm from '@/components/VariantsForm'
import Layout from '@/components/Layout'
import Message from '@/components/Message'

const ProductForm = ({ product: _product, brands, categories, years, token }) => {
  const router = useRouter()

  const [product, setProduct] = useState({
    name: '', 
    description: '', 
    sku:'', 
    priceCents:'', 
    gender: 'male', 
    season: Number(new Date().getFullYear()),
    brandId: '6046fa04f51a684cc0dd792f',
    categoryId: '6046faa7b1b712e25ab0991a',
    variants: [],
    ..._product
  })

  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState('')
  const [messageText, setMessageText] = useState('')

  const validate = () => {
    const validationRes = {error: false, message: ''}
    // Name
    if (product.name === '') {
      validationRes.error = true
      validationRes.message += "Add a name. \n"
    }

    if (product.sku === '') {
      validationRes.error = true
      validationRes.message += 'Add a Sku. '
    }

    if (product.priceCents === '') {
      validationRes.error = true
      validationRes.message += 'Add a Price. '
    }

    if (!product.variants.length) {
      validationRes.error = true
      validationRes.message += 'Add at least a variant. '
    }

    return validationRes
  }

  const handleChangeInput = (i, e) => {
    const values = [...product.variants]
    values[i][e.target.name] = e.target.value
    setProduct({...product, variants: values})
  }

  const handleAdd = () => {
    setProduct({...product, variants: [...product.variants, { id: uuidv4(), color: '', stock: '', size: '' }]})
  }

  const handleSubtract = i => {
    const values = [...product.variants]
    values.splice(i, 1)
    setProduct({...product, variants: [...values]})
  }

  const handleSubmit = async e =>{
    e.preventDefault()
    const validationRes = validate()

    if (validationRes.error) {
      sendMessage(validationRes.message, 'danger', false)
      return
    }

    const prodAux = {
      name: product.name,
      description: product.description,
      brandId: product.brandId,
      categoryId: product.categoryId,
      sku: product.sku,
      season: product.season,
      priceCents: product.priceCents,
      gender: product.gender,
      variants: product.variants
    }

    if (_product._id) {
      // Edit
      const res = await axios.put(`${API_URL}/products/${_product._id}`,
        prodAux,
        { 
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (res.status === 200) {
        sendMessage('Product Modified! Redirecting to product list.', 'success', true)
        return
      }
    } else {
      // Create
      const res = await axios.post(`${API_URL}/products`,
        prodAux,
        { 
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (res.status === 201) {
        sendMessage('Product Created! Redirecting to product list.', 'success', true)
        return
      }
    }

    sendMessage('Error. Please try again.', 'danger', false)
  }

  const sendMessage = (message, className, redirect) => {
    setMessage(true)
    setMessageText(message)
    setMessageType(className)
    setTimeout(() => {
      setMessage(false)
      if (redirect) {
        router.push('/products/list')
      }
    }, 3000)
  }

  return (
    <Layout>
      {message && <Message variant={messageType}>{messageText}</Message>}
      <h1>{product === null ? 'New Product' : 'Edit Product'}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type='text'
            placeholder='Enter Product Name'
            onChange={e => setProduct({...product, name: e.target.value})}
            value={product.name}
          >
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3}
            placeholder='Enter Product Description'
            onChange={e => setProduct({...product, description: e.target.value})}
            value={product.description}
          />
        </Form.Group>
        <Form.Group controlId='priceCents'>
          <Form.Label>Price</Form.Label>
          <Form.Control 
            type='text'
            placeholder='Enter Price'
            onChange={e => setProduct({...product, priceCents: e.target.value})}
            value={(product.priceCents / 100)}
          >
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='sku'>
          <Form.Label>Sku</Form.Label>
          <Form.Control 
            type='text'
            placeholder='Enter Sku'
            onChange={e => setProduct({...product, sku: e.target.value})}
            value={product.sku }
          >
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Gender</Form.Label>
            <div className="mb-3">
              <Form.Check key="male" defaultChecked={product.gender === 'male' || product.gender === ''} inline label="Male" name="gender" type="radio" onChange={e => setProduct({...product, gender: 'male'})} />
              <Form.Check key="female" defaultChecked={product.gender === 'female'} inline label="Female" name="gender" type="radio" onChange={e => setProduct({...product, gender: 'female'})} />
              <Form.Check key="unisex" defaultChecked={product.gendet === 'unisex'} inline label="Unisex" name="gender" type="radio" onChange={e => setProduct({...product, gender: 'unisex'})} />
            </div>
          </Form.Group>
        <Form.Group>
          <Form.Label>Season</Form.Label>
          <Form.Control as='select' defaultValue={product.season} onChange={e => setProduct({...product, season: e.target.value})}>
            {
              years.map(year => (
                <Fragment key={year}>
                  <option value={year}>{year}</option>
                </Fragment>
              ))
            }
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control as='select' defaultValue={product.categoryId} onChange={e => setProduct({...product, categoryId: e.target.value})}>
            {
              categories.map(category => (
                <Fragment key={category._id}>
                  <option value={category._id}>{category.name}</option>
                </Fragment>
              ))
            }
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="brand">
          <Form.Label>Brand</Form.Label>
          <Form.Control as='select' defaultValue={product.brandId} onChange={e => setProduct({...product, brandId: e.target.value})}>
            {
              brands.map(brand => (
                <Fragment key={brand._id}>
                  <option value={brand._id}>{brand.name}</option>
                </Fragment>
              ))
            }
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="variants">
          <Form.Label>Product Variants</Form.Label>
          <Row>
            <Col>
              <Button variant='info' onClick={() => handleAdd()} size="sm">
                Add Variant
              </Button>
            </Col>
          </Row>
            {product.variants.map((variant, i) => (
              <div key={variant.id}>
                <VariantsForm variant={variant} onDelete={() => {handleSubtract(i)}} onChange={(e) => {handleChangeInput(i, e)}} />
              </div>
            ))}
          </Form.Group>
        <Button type='submit' variant='primary'>{product === null ? 'Add Product' : 'Edit Product'}</Button>
      </Form>
    </Layout>
  )
}

ProductForm.defaultProps = {
  product: {}
}

export default ProductForm