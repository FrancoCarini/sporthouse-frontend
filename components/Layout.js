import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'
import { Container, Row } from 'react-bootstrap'

export default function Layout({title, keywords, description, children}) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
      </Head>
      <Header />
      <div>
        <main className='py-3'>
          <Container>
            {children}
          </Container>
        </main>
      </div>
      <Footer />
    </div>
  )
}

Layout.defaultProps = {
  title: 'Sporthouse | Find the best products',
  description: 'Find the best products online',
  keywords: 'shoes, tshirts, sports'
}
