import Link from 'next/link'
import { FaCamera } from 'react-icons/fa'
import { Table } from 'react-bootstrap'
import axios from 'axios'

import {API_URL} from '@/config/index'
import {parseCookies} from '@/helpers/index'

import Layout from '@/components/Layout'
import Message from '@/components/Message'
import Loader from '@/components/Loader'

export default function AllOrdersPage ({ products }) {
  return (
    <Layout title='Products'>
      <h1>Products</h1> 
      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Season</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.brand.name}</td>
              <td>{product.category.name}</td>
              <td>{product.season}</td>
              <td>
                <Link href={`/products/list/${product._id}`}>
                  <a className='btn btn-warning btn-sm'>
                    <FaCamera size={15} />
                  </a>
              </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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

  if (user.role !== 'admin') {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }

  const res = await axios.get(`${API_URL}/products`)
  return {
    props: {
      products: res.data.data
    }
  }
}
