import axios from 'axios'
import { Row, Col, Form, Button, Accordion, Card } from 'react-bootstrap'
import { FaFilter } from 'react-icons/fa'
import { useState, useEffect, Fragment } from 'react'

import { API_URL, PRODUCTS_PER_PAGE } from '@/config/index'

import Product from '@/components/Product'
import Layout from '@/components/Layout'
import Paginator from '@/components/Paginator'
import Loader from '@/components/Loader'


// PASAR URL AL PAGINADORRRRRRRR

export default function HomePage({ products: prods, page, filters: filts }) {
  const [checkedElements, setCheckedElements] = useState([])
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState(prods)
  const [apiFilters, setApiFilters] = useState([])
  const [filters, setFilters] = useState(filts)

  useEffect(async () => {
    if (apiFilters.length) {
      let apiUrlStr = ''
      apiFilters.forEach(filter => {
        apiUrlStr += `&${filter.name.toLowerCase()}${filter.value.includes('[') ? '[in]' : ''}=${filter.value}`
      })
      
      if (apiUrlStr.includes('brand')) {
        apiUrlStr = apiUrlStr.replace("brand", "brand.name");
      }

      if (apiUrlStr.includes('category')) {
        apiUrlStr = apiUrlStr.replace("category", "category.name");
      }

      if (apiUrlStr.includes('size')) {
        apiUrlStr = apiUrlStr.replace("size", "variants.size");
      }

      const [prodResponse, filterResponse] = await Promise.all([
        axios.get(`${API_URL}/products?&page=${page}&limit=${PRODUCTS_PER_PAGE}${apiUrlStr}`), 
        axios.get(`${API_URL}/products/filters?${apiUrlStr}`)
      ])
      setProducts(prodResponse.data)
      setFilters(filterResponse.data.filters)

      setLoading(false)
    }
  }, [apiFilters])

  const handleFilters = async (e, identifier) => {
    setLoading(true)
    
    const newFilter = identifier.split('-')
    const filterIndex = apiFilters.findIndex(f => newFilter[0] === f.name)
    if (e.target.checked) {
      setCheckedElements([...checkedElements, identifier])

      if (filterIndex > -1) {
        const auxStr = `[${apiFilters[filterIndex].value.split('[').pop().split(']')[0]},${newFilter[1]}]`
        const newFilterArray = [...apiFilters]
        newFilterArray[filterIndex] = {name: newFilter[0], value: auxStr}
        setApiFilters(newFilterArray)
      } else {
        setApiFilters([...apiFilters, {name: newFilter[0], value: newFilter[1]}])
      }
    } else {
      // Remove from Checked elements
      setCheckedElements(checkedElements.filter(ce => ce !== identifier))

      if (apiFilters[filterIndex].value.includes('[')) {
        let auxStr = `${apiFilters[filterIndex].value.split('[').pop().split(']')[0]}`.replace(newFilter[1],'')
        auxStr = auxStr.split(',').filter(item => item).join(',')
        const newFilterArray = [...apiFilters]
        newFilterArray[filterIndex] = {name: newFilter[0], value: auxStr}
        setApiFilters(newFilterArray)
      } else {
        setApiFilters(apiFilters.filter(f => f.name !== newFilter[0]))
      }
    }
  }

  const handleResetFilters = async () => {
    setLoading(true)
    setCheckedElements([])

    const prods = await axios.get(`${API_URL}/products?page=${page}&limit=${PRODUCTS_PER_PAGE}`)
    const filts = await axios.get(`${API_URL}/products/filters`)

    setProducts(prods.data)
    setFilters(filts.data.filters)
    setLoading(false)
  }

  if (loading) return <Layout><Loader /></Layout>

  return (
    <Layout>
    <Accordion style={{marginBottom: '20px'}}>
    <Card style={{border: 'none'}}>
      <Card.Header style={{backgroundColor: '#fff'}}>
        <Accordion.Toggle as={Button} variant="secondary" eventKey="0" style={{background: '#B3B2B2'}}>
          <FaFilter /> Filter
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey="0">
        <Card.Body>
        <Form>
          {
            Object.keys(filters).map( key => (
              <Fragment key={key}>
                <h5>{key}</h5>
                  <Form.Group >
                    {filters[key].map(check => (
                      <Fragment key={`${key}-${check}`}>
                        <Form.Check 
                          inline 
                          type="checkbox" 
                          label={check} 
                          value={check} 
                          checked={ checkedElements.findIndex(el => el === `${key}-${check}`) > -1}
                          onChange={ e => handleFilters(e, `${key}-${check}`) }
                        />
                      </Fragment>
                    ))}
                  </Form.Group>
              </Fragment>
            ))
          }
          <Button type='button' onClick={handleResetFilters} variant='danger'>Reset Filter</Button>
        </Form>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  </Accordion>
  <div className="d-flex justify-content-center"></div>
  <h1>Products</h1>
      <Row>
        {products.data.map(product => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
      <Paginator page={page} prevNext={products.pagination} />
    </Layout>
  )
}

export async function getServerSideProps({ query: { page = 1 } }) {
  if (isNaN(page)) {
    page = 1
  }

  const [prods, filts] = await Promise.all([
    axios.get(`${API_URL}/products?page=${page}&limit=${PRODUCTS_PER_PAGE}`), 
    axios.get(`${API_URL}/products/filters`)
  ])

  return {
    props: { 
      products: prods.data,
      page,
      filters: filts.data.filters
    }
  }
}
