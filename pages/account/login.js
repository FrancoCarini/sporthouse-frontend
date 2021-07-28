import { useState, useContext } from 'react'
import Link from 'next/link'
import { Row, Col, Button, Form } from 'react-bootstrap'

import FormContainer from '@/components/FormContainer'
import Layout from '@/components/Layout'
import AuthContext from '@/context/AuthContext'
import Message from '@/components/Message'
import Loader from '@/components/Loader'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {login, error, loading} = useContext(AuthContext)

  const loginHandle = async e => {
    e.preventDefault()
    login({email, password})
  }

  return (
    <Layout>
      <FormContainer>
        <h1>Sign In</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={loginHandle}>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
              type='email'
              placeholder='Enter Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type='password'
              placeholder='Enter Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary'>Sign In</Button>
        </Form>

        <Row className='py-3'>
          <Col>
            New Customer?{' '}
            <Link href="/account/register">
              <a>Register</a>
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </Layout>
  )
}
