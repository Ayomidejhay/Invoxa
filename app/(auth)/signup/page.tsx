import React from 'react'
import { Suspense } from 'react'
import SignUp from '../components/SignUp'

const page = () => {
  return (
    <Suspense fallback={null}>
      <SignUp />
    </Suspense>
  )
}

export default page