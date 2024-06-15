import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface Props {
  children: React.ReactNode;
}
const Layout = ({children}: Props) => {
  return <div className="flex flex-col min-h-screen">
    <Header />
    <div className="container mx-auto py-10 flex-1">{children}</div>
    <Footer />
  </div>
}

export default Layout
