import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Dash from '../components/Dash'
import Bento from '../components/Bento'
import Footer from '../components/Footer'

const HomePage:React.FC = () => {
  return (
    <div className="overflow-x-hidden">
        <Header />
        <Hero />
        <Dash />
        <Bento />
        <Footer />
    </div>
  )
}

export default HomePage
