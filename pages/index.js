import { Row, Col, Form, Button, Accordion, Card } from 'react-bootstrap'
import Product from '@/components/Product'
import Layout from '@/components/Layout'
import Paginator from '@/components/Paginator'
import Loader from '@/components/Loader'
import { API_URL, PRODUCTS_PER_PAGE } from '@/config/index'
import { useState, useEffect } from 'react'
import { FaFilter } from 'react-icons/fa'
import axios from 'axios'

export default function HomePage({ prods, page, filters }) {
  const [checkedElements, setCheckedElements] = useState([])
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState(prods)
  const [apiFilters, setApiFilters] = useState([])

  useEffect(async () => {
    let apiUrlStr = ''
    apiFilters.forEach(filter => {
      apiUrlStr += `&${filter.name}${filter.value.includes('[') ? '[in]' : ''}=${filter.value}`
    })

    const response = await axios.get(`${API_URL}/products?&page=${page}&limit=${PRODUCTS_PER_PAGE}${apiUrlStr}`)
    setProducts(response.data)
    setLoading(false)
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
    // TODO: Hacer query original y traer los resultados originales

    setLoading(false)
  }

  return (
    <Layout>
    {loading ? <Loader /> : (
      <>
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
          {filters.map(filter => (
            <>
              <h5>{filter.filterCategory}</h5>
              {
                <Form.Group key={`${filter.filterCategory}`}>
                  {filter.checks.map(check => (
                    <>
                      <Form.Check 
                        key={`${filter.filterCategory}-${check.value}`} 
                        inline 
                        type="checkbox" 
                        label={check.label} 
                        value={check.value} 
                        checked={ checkedElements.findIndex(el => el === `${filter.filterCategory}-${check.value}`) > -1 ? true : false}
                        onChange={ e => handleFilters(e, `${filter.filterCategory}-${check.value}`) }
                      />
                    </>
                  ))}
                </Form.Group>
              }
            </>
          ))}
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
      </>
      )}
    </Layout>
  )
}

export async function getServerSideProps({ query: { page = 1 } }) {
  if (isNaN(page)) {
    page = 1
  }

  const res = await fetch(`${API_URL}/products?page=${page}&limit=${PRODUCTS_PER_PAGE}`)
  const prods = await res.json()

  const filters = [
    {
      "filterCategory": "category",
      "checks": [
        {
          "label": "Shoes",
          "value": "Shoes"
        },
        {
          "label": "T-shirts",
          "value": "T-shirts"
        },
        {
          "label": "Pants",
          "value": "Pants"
        },
        {
          "label": "Shorts",
          "value": "Shorts"
        }
      ]
    },
    {
      "filterCategory": "size",
      "checks": [
        {
          "label": "38",
          "value": "38"
        },
        {
          "label": "39",
          "value": "39"
        },
        {
          "label": "40",
          "value": "40"
        },
        {
          "label": "41",
          "value": "41"
        }
      ]
    },
    {
      "filterCategory": "gender",
      "checks": [
        {
          "label": "male",
          "value": "male"
        },
        {
          "label": "female",
          "value": "female"
        },
        {
          "label": "unisex",
          "value": "unisex"
        }
      ]
    }
  ]

  return {
    props: { 
      prods,
      page,
      filters
    }
  }
}
