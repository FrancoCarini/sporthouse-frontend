import Link from 'next/link'
import Image from 'next/image'
import { Card, Col, Row, Form, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'

import {API_URL} from '@/config/index'
import {parseCookies} from '@/helpers/index'

import Layout from '@/components/Layout'
import Loader from '@/components/Loader'

export default function EditProductPage ({ product, token }) {
  const [imageSrc, setImageSrc] = useState(product.image)
  const [uploadedImage, setUploadedImage] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmitFile = async e => {
    setLoading(true)
    e.preventDefault()
    let formData = new FormData()
    formData.append('file', uploadedImage)

    const res = await axios.put(`${API_URL}/products/${product._id}/photo`, formData,
      { 
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (res.status === 200) {
      setImageSrc(res.data.image)
    }
  }

  const handleFileInputChange = e => {
    setUploadedImage(e.target.files[0])
  }

  useEffect(() => {
    if (!imageSrc) {
      setLoading(true)
    }
    setLoading(false)
  }, [imageSrc])

  if (loading) return <Layout title='Edit Product'><Loader /></Layout>

  return (
    <Layout title='Edit Product'>
      <Row className="mb-2">
        <Col sm={12}>
          <Link href={`/products/list`}>
            <a className='btn btn-primary btn-sm'>
              Go Back
            </a>
          </Link>
        </Col>
      </Row>
      
      <Row>
        <Col sm={12}>
          <h1>{product.name}</h1>
        </Col>
      </Row>
      <Row>
        <Col >
          <Card className="my-3 p-3 rounded">
            <Image src={imageSrc} alt={product.name} width={640} height={510}/>
          </Card>
        </Col>
        
        <Col sm={12} md={6} lg={4} xl={3}>
          <Card border="light" className="my-3 p-3 rounded">
          <Form onSubmit={handleSubmitFile}>
            <Form.Group>
              <Form.File 
                label="File Input" 
                onChange={handleFileInputChange}
              />
            </Form.Group>
            <Button type='submit' variant='info'>Upload Image</Button>
          </Form>
          </Card>
        </Col>
      </Row>
      
      
    </Layout>
  )
}

export async function getServerSideProps({ req, query }) {
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

  if (user.role !== 'admin') {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }

  const res = await axios.get(`${API_URL}/products/${query.id}`,{
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`
    }
  })

  return {
    props: {
      product: res.data.product,
      token: user.token
    }
  }
}