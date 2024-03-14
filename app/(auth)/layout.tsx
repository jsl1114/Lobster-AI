import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='flex h-screen dark:bg-[#111827]  items-center justify-center'>
      {children}
    </main>
  )
}
export default AuthLayout
