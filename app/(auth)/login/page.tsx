import React, { Suspense } from 'react'
import Login from '../components/Login'

export default function page() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  )
}
