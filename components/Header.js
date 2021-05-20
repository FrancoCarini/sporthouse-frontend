import Link from 'next/link'
import { Container, Nav, Navbar, NavDropdown, LinkContainer } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { useContext } from 'react'
import AuthContext from '@/context/AuthContext'

export default function Header() {
  const { user, logout } = useContext(AuthContext)

  return (
    <header>
      <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
        <Container>
          <Link href='/' passHref>
            <Navbar.Brand>sporthouse</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
            <Link href='/events' passHref>
              <Nav.Link><FaShoppingCart /> Cart</Nav.Link>
            </Link>
            {user ? (
              <NavDropdown title={user.name} id='username'>
                <Link href='/account/profile'>
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </Link>
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
