import React, { Children } from 'react'

function container({children}) {
  return (
    <div className='w-full max-w-7 mx-auto px-4'>
        {children}
    </div>
  )
}

export default container