import axios from 'axios'
import { useState, Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'

import { API_URL } from '@/config/index'

import ProductForm from '@/components/ProductForm'
import { parseCookies } from '@/helpers/index'

export default function NewProductPage({ brands, categories, years, token }) {
  const router = useRouter()

  return (
    <ProductForm brands={brands} categories={categories} years={years} token={token} />
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