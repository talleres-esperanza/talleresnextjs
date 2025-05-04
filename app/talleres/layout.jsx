import React from 'react'
import Provider from '../Provider'

const Layout = ({children}) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}

export default Layout
