import { useState } from 'react'
import {API_URL} from '@/config/index'
import {parseCookies} from '@/helpers/index'
import Link from 'next/link'
import { Table, Button } from 'react-bootstrap'
import axios from 'axios'
import Layout from '@/components/Layout'
import dayjs from 'dayjs'
import { FaEye, FaTrash } from 'react-icons/fa'
import Message from '@/components/Message'
import Loader from '@/components/Loader'

export default function OrderListPage ({ orders, token }) {
  const [listOrders, setListOrders] = useState(orders)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageVariant, setMessageVariant] = useState('')

  const getOrders = async (token) => {
    const res = await axios.get(`${API_URL}/users/me`, 
      { 
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    setListOrders(res.data.orders)
  }

  const cancelOrderHandler = async id => {
    setLoading(true)
    const res =  await axios.delete(`${API_URL}/orders/${id}`, 
      { 
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    setLoading(false)
    if (res.status === 200) {
      await getOrders(token)
      setMessage(`Order ${id} has been cancelled.`)
      setMessageVariant('success')
    } else {
      setMessage(`There was an error cancelling order ${id}.`)
      setMessageVariant('danger')
    }
  }

  return (
    <Layout title='Orders'>
     <h1>Orders</h1> 
      {message !== '' && <Message variant={messageVariant}>{message}</Message>}
      {loading ? <Loader /> : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listOrders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>${ (order.totalPriceCents / 100).toFixed(2) }</td>
                <td>{dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                <td>{order.status}</td>
              <td>
                <Link href={`/order/${order._id}`}>
                  <a class='btn btn-info btn-sm'>
                      <FaEye size={15} />
                  </a>
                </Link>
                {' '}{' '}
                {order.status === 'confirmed' && (
                  <Button type='button' class='btn btn-danger btn-sm' onClick={() => cancelOrderHandler(order._id) }>
                    <FaTrash size={15} />
                  </Button>
                )}
              </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
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

  const res = await axios.get(`${API_URL}/users/me`, 
    { 
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
  )

  return {
    props: {
      orders: res.data.orders,
      token: user.token
    }
  }
}
