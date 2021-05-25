import {API_URL} from '@/config/index'
import {parseCookies} from '@/helpers/index'
import Link from 'next/link'
import { Table, Button } from 'react-bootstrap'
import axios from 'axios'
import Layout from '@/components/Layout'
import dayjs from 'dayjs'
import { FaClipboardList, FaTrash } from 'react-icons/fa'

export default function OrderListPage ({ orders }) {
  const deleteHandler = id => {
    dispatch(deleteUser(id))
  }

  return (
    <Layout title='Orders'>
     <h1>Orders</h1> 
      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Total</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>${ (order.totalPriceCents / 100).toFixed(2) }</td>
              <td>{dayjs(order.date).format('YYYY-MM-DD HH:mm:ss')}</td>
            <td>
              <Link href={`/order/${order._id}`}>
                <a class='btn btn-info btn-sm'>
                    <FaClipboardList size={15} />
                </a>
              </Link>
              {' '}{' '}
              <Button type='button' class='btn btn-danger btn-sm'>
                <FaTrash size={15} />
              </Button>
            </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req)

  if (token === undefined) {
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
        Authorization: `Bearer ${token}`
      }
    }
  )

  return {
    props: {
      orders: res.data.orders
    }
  }
}
