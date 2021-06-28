import Link from 'next/link'
import { Container, Nav, Navbar, NavDropdown, Button, FormControl, InputGroup, Col } from 'react-bootstrap'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { useContext, useState } from 'react'
import axios from 'axios'

import { API_URL } from '@/config/index'

import AuthContext from '@/context/AuthContext'
import { CartContext } from '@/context/CartContext'

export default function Header() {
  const { user, logout } = useContext(AuthContext)
  const { cart } = useContext(CartContext)
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async query => {
    setLoading(true)
    const res = await axios.get(`${API_URL}/products/search/${encodeURI(query)}`)
    setProducts(res.data.products)
    setLoading(false)
  }

  return (
    <header>
      <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
        <Container>
          <Link href='/' passHref>
            <Navbar.Brand>sporthouse</Navbar.Brand>
          </Link>
          <Col md={6}>
            <AsyncTypeahead
              filterBy={() => true}
              labelKey="name"
              id="search-products"
              placeholder="Search ..."
              onSearch={handleSearch}
              minLength={3}
              options={products}
              isLoading={loading}
              renderMenuItemChildren={(option, props) => (
                <>
                  <img
                    alt={option.name}
                    src={option.image}
                    style={{
                      height: '24px',
                      marginRight: '10px',
                      width: '24px',
                    }}
                  />

                  <Link href={`/products/${option.slug}`}><a>{option.brand.name} - {option.name}</a></Link>
                </>
              )}
            />
          </Col>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <NavDropdown title={<><FaShoppingCart /> Cart</>} id='cart'>
              Your cart has {cart.length > 0 ?  cart.length  : 'no' } items
                {cart.length > 0 && 
                  <NavDropdown.Item>
                    <Link href='/cart'>
                      <a>
                        <Button variant="info" size="sm">Check Cart</Button>
                      </a>
                    </Link>
                  </NavDropdown.Item>
                }
              </NavDropdown>
              {user ? (
                <NavDropdown title={user.name} id='username'>
                  {user.role === 'admin' && <NavDropdown.Item><Link href='/products/new'><a>New Product</a></Link></NavDropdown.Item>}
                  <NavDropdown.Item><Link href='/account/profile'><a>Profile</a></Link></NavDropdown.Item>
                  <NavDropdown.Item><Link href='/order'><a>My Orders</a></Link></NavDropdown.Item>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : ( 
                <Link href='/account/login' passHref>
                  <Nav.Link><FaUser /> Sign In</Nav.Link>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}
