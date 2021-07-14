import axios from 'axios'

import {parseCookies} from '@/helpers/index'
import {API_URL} from '@/config/index'

import Layout from '@/components/Layout'
import FormReview from '@/components/FormReview'

export default function RatingPage({ products, token }) {
  return (
    <Layout title='Rating'>
      {
        products.map(product => (
          <FormReview key={product._id} product={product} token={token} />
        ))
      }
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

  const products = await axios.get(`${API_URL}/reviews/pending`, { 
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })

  return {
    props: { 
      products: products.data.data.products,
      token: user.token
    }
  }
}