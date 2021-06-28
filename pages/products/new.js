import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { useState, Fragment } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'

import { API_URL } from '@/config/index'

import Layout from '@/components/Layout'
import Message from '@/components/Message'
import { parseCookies } from '@/helpers/index'

export default function NewProductPage({ brands, categories, years, token }) {
  const [productVariants, setProductVariants] = useState([])
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [gender, setGender] = useState('')
  const [season, setSeason] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [validationFail, setValidationFail] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')


  const handleChangeInput = (i, e) => {
    const values = [...productVariants]
    productVariants[i][e.target.name] = e.target.value
    setProductVariants(values)
  }


  const handleAdd = () => {
    setProductVariants([...productVariants, { id: uuidv4(), color: '', stock: '', size: '' }])
  }

  const handleSubtract = i => {
    const values = [...productVariants]
    values.splice(i, 1)
    setProductVariants([...values])
  }

  const handleSubmit = e => {
    e.preventDefault()
    const validationRes = validate()

    if (validationRes.error) {
      setValidationFail(true)
      setValidationMessage(validationRes.message)
      setTimeout(() => {
        setValidationFail(false)
      }, 3000)
    }
  }

  const validate = () => {
    const validationRes = {error: false, message: ''}
    // Name
    if (name === '') {
      validationRes.error = true
      validationRes.message += "Add a name. \n"
    }

    if (sku === '') {
      validationRes.error = true
      validationRes.message += 'Add a Sku. '
    }

    if (price === '') {
      validationRes.error = true
      validationRes.message += 'Add a Sku. '
    }

    if (!productVariants.length) {
      validationRes.error = true
      validationRes.message += 'Add at least a variant. '
    }

    return validationRes
  }

  return (
    <Layout>
        {validationFail && <Message variant='danger'>{validationMessage}</Message>}
        <h1>New Product</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type='text'
              placeholder='Enter Product Name'
              onChange={e => setName(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control 
              type='text'
              placeholder='Enter Price'
              onChange={e => setPrice(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='sku'>
            <Form.Label>Sku</Form.Label>
            <Form.Control 
              type='text'
              placeholder='Enter Sku'
              onChange={e => setSku(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='gender'>
            <Form.Label>Gender</Form.Label>
              <div className="mb-3">
                <Form.Check checked inline label="Male" name="gender" type="radio"  onChange={() => setGender('male')}/>
                <Form.Check inline label="Female" name="gender" type="radio"  onChange={() => setGender('female')} />
                <Form.Check inline label="Unisex" name="gender" type="radio"  onChange={() => setGender('unisex')} />
              </div>
            </Form.Group>
          <Form.Group controlId="season">
            <Form.Label>Season</Form.Label>
            <Form.Control as='select' defaultValue={Number(new Date().getFullYear())} onChange={e => setSeason(e.target.value)}>
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
            <Form.Control as='select' onChange={e => setCategory(e.target.value)}>
              {
                categories.map(category => (
                  <Fragment key={category._id}>
                    <option value={category._id}>{category.name}</option>
                  </Fragment>
                ))
              }
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="brand" onChange={e => setBrand(e.target.value)}>
            <Form.Label>Brand</Form.Label>
            <Form.Control as='select'>
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
              {productVariants.map((variant, i) => (
                <div key={variant.id}>
                  <Row className="mt-3">
                    <Col>
                      <Form.Label>Color</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Color"
                        name="color"
                        value={variant.color}
                        onChange={e => handleChangeInput(i, e)}
                      />
                    </Col>
                    <Col>
                      <Form.Label>Size</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Size"
                        name="size"
                        value={variant.size}
                        onChange={e => handleChangeInput(i, e)}
                      />
                    </Col>
                    <Col>
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Stock"
                        name="stock"
                        value={variant.stock}
                        onChange={e => handleChangeInput(i, e)}
                      />
                    </Col>
                    <Col>
                      <Button variant='danger' onClick={() => handleSubtract(i)} className="mt-4">
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </Form.Group>
          <Button type='submit' variant='primary'>Add Product</Button>
        </Form>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const cookies = parseCookies(req)

  const user = JSON.parse(cookies.user)

  if (typeof user.token === 'undefined') {
    return {
      redirect: {
        permanent: false,
        destination: "/account/login"
      }
    }
  }

  if (typeof user.role !== 'admin') {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }
  
  const [brands, categories] = await Promise.all([
    axios.get(`${API_URL}/brands`),
    axios.get(`${API_URL}/categories`)
  ])

  const currentYear = new Date().getFullYear()
  const years = [currentYear - 2, currentYear - 1, currentYear]

  return {
    props: { 
      brands: brands.data.data,
      categories: categories.data.data,
      years,
      token: user.token
    }
  }
}