import {useState, useContext, useEffect} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Row, Col, Button, Form } from 'react-bootstrap'

import AuthContext from '@/context/AuthContext'
import FormContainer from '@/components/FormContainer'
import Layout from '@/components/Layout'
import Message from '@/components/Message'
import Loader from '@/components/Loader'

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [message, setMessage] = useState(false)
  const [messageType, setMessageType] = useState('')
  const [messageText, setMessageText] = useState('')

  const {register, error, loading} = useContext(AuthContext)

  const validate = () => {
    const validationRes = {error: false, message: ''}

    if (name === '') {
      validationRes.error = true 
      validationRes.message = 'Name could not be empty. Please try again.'
      return validationRes
    }

    if (password !== passwordConfirm) {
      validationRes.error = true 
      validationRes.message = 'Passwords must match. Please try again.'
      return validationRes
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationRes.error = true 
      validationRes.message = 'Email is not valid. Please try again.'
    }

    return validationRes
  }

  useEffect(() => {
    if (error) {
      sendMessage(error, 'danger', false)
    }
  }, [error])

  const handleSubmit = async e => {
    e.preventDefault()
    const validationRes = validate()

    if (validationRes.error) {
      sendMessage(validationRes.message, 'danger', false)
      return
    }

    register(name, email, password, passwordConfirm)
  }

  const sendMessage = (message, className, redirect) => {
    setMessage(true)
    setMessageText(message)
    setMessageType(className)
    setTimeout(() => {
      setMessage(false)
      if (redirect) {
        router.push('/')
      }
    }, 3000)
  }

  return (
    <Layout>
      {message && <Message variant={messageType}>{messageText}</Message>}
      {loading && <Loader />}
      <FormContainer>
        <h1>Sign Up</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type='text'
              placeholder='Enter Name'
              onChange={e => setName(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
              type='email'
              placeholder='Enter Email'
              onChange={e => setEmail(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type='password'
              placeholder='Enter Password'
              onChange={e => setPassword(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='passwordConfirm'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
              type='password'
              placeholder='Confirm Password'
              onChange={e => setPasswordConfirm(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary'>Register</Button>
        </Form>

        <Row className='py-3'>
          <Col>
            Have and account?{' '}
            <Link href='/account/login'>Login</Link>  
          </Col>
        </Row>
      </FormContainer>
    </Layout>
  )
}
