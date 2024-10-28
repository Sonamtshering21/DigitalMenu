import Header from '@/components/Header'
import React from 'react'

const Menulayout = ({children}) => {
  return (
    <div>
      <Header/>
      {children}
    </div>
  )
}

export default Menulayout
