import React from 'react'
import { Container } from 'react-bootstrap'
import Footer from './components/Footer'
import Header from './components/Header'

const App = () => {
  return (
    <>
      <Header />
      <Container>
        <main className='py-3'>
          <h1>Welcome to the shop</h1>
        </main>
      </Container>
      <Footer />
    </>
  )
}

export default App
